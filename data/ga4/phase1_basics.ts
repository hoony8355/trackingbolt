import { Lesson, TrackingEvent } from '../../types';

const findGa4Event = (events: TrackingEvent[], command: string, arg0?: string) => {
  return events.find(e => 
    e.type === 'GA4' && 
    e.command === command && 
    (!arg0 || e.args[0] === arg0)
  );
};

export const ga4Phase1: Lesson[] = [
  {
    id: 'ga4-p1-config',
    track: 'GA4',
    title: '1. GA4의 심장, 초기화 (Config)',
    description: `
### 📡 개념 학습: 라이브러리 vs 초기화
HTML 상단에 \`<script>\` 태그를 넣었다고 해서 GA4가 바로 동작하는 것은 아닙니다.
그것은 단지 총(Library)을 가져온 것일 뿐, **어느 과녁(Measurement ID)을 향해 쏠지**는 정해주지 않았기 때문입니다.

\`gtag('config', ...)\` 명령어는 GA4의 심장을 뛰게 하는 첫 번째 단계입니다.
이 코드가 실행되어야 비로소 구글 서버와 통신 라인이 개통됩니다.

\`\`\`javascript
// 문법: gtag('config', '측정ID');
gtag('config', 'G-KOR-123456');
\`\`\`

---

### 📝 실습 가이드
1. 우측 하단 **[Mission]** 탭의 체크리스트를 확인하세요.
2. 측정 ID **\`G-TRACK-DEMO\`**를 사용하여 GA4를 초기화하는 코드를 작성하세요.
    `,
    preCode: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TRACK-DEMO"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());`,
    initialCode: `  // 여기에 코드를 작성하세요.
  
`,
    postCode: `</script>`,
    tasks: [
      {
        id: 'problem1',
        description: "config 명령어로 ID 'G-TRACK-DEMO' 연결하기",
        validate: (events) => {
          const hasConfig = findGa4Event(events, 'config', 'G-TRACK-DEMO');
          if (!hasConfig) {
            // Check if they used a wrong ID
            const wrongConfig = findGa4Event(events, 'config');
            if (wrongConfig) return { passed: false, message: `ID가 다릅니다. 입력된 ID: ${wrongConfig.args[0]}` };
            return { passed: false, message: "config 명령어가 발견되지 않았습니다." };
          }
          return { passed: true, message: "GA4 초기화 성공!" };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');`
  },
  {
    id: 'ga4-p1-auto-pv',
    track: 'GA4',
    title: '2. 데이터 검증하기 (Stream Debugging)',
    description: `
### 📡 개념 학습: "보냈으면 확인하라"
개발자의 역할은 코드를 짜는 것에서 끝나지 않습니다. **데이터가 실제로 잘 날아갔는지(Network Request)** 확인하는 것이 트래킹의 핵심입니다.

GA4는 \`config\`가 실행되는 순간, 편리함을 위해 자동으로 \`page_view\`(페이지 조회) 이벤트를 전송합니다. 이를 **암묵적 수집**이라고 합니다.

---

### 📝 실습 가이드
이번 레슨은 코드를 작성한 후 **검증**하는 과정이 중요합니다.
1. \`config\` 코드를 작성하고 실행하세요.
2. 우측 하단의 **[Stream]** 탭을 눌러 자동으로 생성된 \`page_view\` 이벤트를 직접 눈으로 확인하세요.
    `,
    initialCode: `  // 1. GA4 초기화 코드를 작성하세요.
  `,
    tasks: [
      {
        id: 'problem1',
        description: "config 코드로 GA4 연결하기",
        validate: (events) => {
           const hasConfig = findGa4Event(events, 'config', 'G-TRACK-DEMO');
           return { passed: !!hasConfig, message: hasConfig ? "연결 성공" : "config 코드가 실행되지 않았습니다." };
        }
      },
      {
        id: 'problem2',
        description: "Stream 탭에서 자동 생성된 page_view 확인하기",
        validate: (events) => {
          // Check specifically if page_view was triggered implicitly by config
          const hasPV = findGa4Event(events, 'page_view') || findGa4Event(events, 'event', 'page_view'); 
          return { passed: !!hasPV, message: hasPV ? "자동 수집 이벤트 감지됨 (성공)" : "config가 정상 실행되면 자동으로 뜹니다." };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');`
  },
  {
    id: 'ga4-p1-pv-disable',
    track: 'GA4',
    title: '3. SPA의 딜레마 (자동 수집 끄기)',
    description: `
### 📡 개념 학습: React/Vue 환경의 문제점
쇼핑몰이 **SPA(Single Page Application)**로 만들어졌다면, 페이지가 바뀔 때 브라우저가 새로고침되지 않습니다.
하지만 GA4의 기본 \`config\`는 **"새로고침 될 때만"** 페이지 뷰를 보냅니다.

결과적으로:
1.  처음 접속할 때만 카운팅되고, 쇼핑하는 내내 조회수가 0이 되거나,
2.  개발자가 수동으로 보낸 것과 겹쳐서 **조회수가 2배(Double Counting)**로 튀는 참사가 벌어집니다.

이를 막기 위해 모던 웹 개발 환경에서는 **자동 수집 기능을 끄고(false), 100% 수동으로 제어**하는 것이 정석입니다.

**문법 힌트:**
\`\`\`javascript
gtag('config', 'ID', {
  옵션명: false
});
\`\`\`
    `,
    initialCode: `  // 설정을 추가하여 자동 페이지 뷰를 차단하세요.
  gtag('config', 'G-TRACK-DEMO', {
    
  });`,
    tasks: [
      {
        id: 'problem1',
        description: "send_page_view: false 옵션 적용하기",
        validate: (events) => {
          const config = findGa4Event(events, 'config', 'G-TRACK-DEMO');
          const options = config?.args[1];
          
          if (!options) return { passed: false, message: "설정 객체 {}가 누락되었습니다." };
          if (options.send_page_view !== false) return { passed: false, message: "send_page_view가 false가 아닙니다." };

          return { 
            passed: true, 
            message: "설정 완료: 이제 페이지 뷰가 자동으로 전송되지 않습니다." 
          };
        }
      },
      {
        id: 'problem2',
        description: "page_view 이벤트가 발생하지 않았는지 확인하기",
        validate: (events) => {
           const hasPV = findGa4Event(events, 'page_view') || findGa4Event(events, 'event', 'page_view'); 
           return { passed: !hasPV, message: !hasPV ? "성공: 불필요한 자동 이벤트 차단됨" : "실패: 여전히 page_view가 전송되고 있습니다." };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO', {
    send_page_view: false
  });`
  },
  {
    id: 'ga4-p1-pv-manual-static',
    track: 'GA4',
    title: '4. 수동 제어권 가져오기 (Manual Event)',
    description: `
### 📡 개념 학습: 직접 신호 쏘기
자동 기능을 껐으니, 이제 **"지금이 페이지를 본 순간이야!"** 라고 직접 GA4에 알려줘야 합니다.
이때 사용하는 명령어가 바로 \`event\`입니다.

가장 기본이 되는 **\`page_view\`** 이벤트조차도 사실은 수많은 이벤트 중 하나일 뿐입니다.
우리는 이 이벤트에 **상세 정보(Parameter)**를 꼬리표처럼 붙여서 보낼 수 있습니다.

---

### 📝 실습 가이드
1. 자동 수집 끄기 설정은 이미 되어있습니다.
2. 미션 탭의 요구사항(이벤트명, 파라미터)을 보고 코드를 완성하세요.
    `,
    initialCode: `  // 1. 자동 수집 끄기 (작성됨)
  gtag('config', 'G-TRACK-DEMO', { send_page_view: false });

  // 2. 수동으로 page_view 이벤트 전송
  
  `,
    tasks: [
      {
        id: 'problem1',
        description: "page_view 이벤트 직접 전송하기",
        validate: (events) => {
          return { passed: !!findGa4Event(events, 'event', 'page_view'), message: "page_view 이벤트가 감지되지 않았습니다." };
        }
      },
      {
        id: 'problem2',
        description: "파라미터 포함: page_title='겨울 코트 특가전', page_referrer='https://naver.com'",
        validate: (events) => {
          const pv = findGa4Event(events, 'event', 'page_view');
          const args = pv?.args[1] || {};
          
          if (args.page_title !== '겨울 코트 특가전') return { passed: false, message: "page_title이 요구사항과 다릅니다." };
          if (args.page_referrer !== 'https://naver.com') return { passed: false, message: "page_referrer가 요구사항과 다릅니다." };

          return { 
            passed: true, 
            message: "성공: 상세 정보를 포함한 수동 전송 완료." 
          };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO', { send_page_view: false });

  gtag('event', 'page_view', {
    page_title: '겨울 코트 특가전',
    page_referrer: 'https://naver.com'
  });`
  },
  {
    id: 'ga4-p1-pv-manual-dynamic',
    track: 'GA4',
    title: '5. 살아있는 데이터 만들기 (Dynamic Variables)',
    description: `
### 📡 개념 학습: 하드코딩 멈춰! ✋
이전 레슨처럼 \`'겨울 코트'\`라고 제목을 직접 적어버리면(하드코딩), 
청바지 페이지에 가서도 "겨울 코트 봤음"이라고 보고하게 됩니다.

개발자는 **"현재 브라우저의 상태"**를 읽어오는 변수를 사용해야 합니다.
그래야 코드 하나로 수천 개의 상품 페이지를 모두 정확하게 추적할 수 있습니다.

*   \`document.title\`: 현재 탭의 제목 (예: "장바구니 | MyShop")
*   \`location.href\`: 현재 전체 주소 (예: "https://myshop.com/cart")

---

### 📝 실습 가이드
고정된 문자열 대신, 자바스크립트 변수를 사용하여 데이터를 동적으로 전송하세요.
    `,
    preCode: `<script>
  // [가상 브라우저 환경 변수]
  // document.title = "장바구니 | MyShop"
  // location.href = "https://www.myshop.com/cart"
</script>`,
    initialCode: `  gtag('config', 'G-TRACK-DEMO', { send_page_view: false });

  gtag('event', 'page_view', {
    page_title: '여기에_변수를_넣으세요',
    page_location: '여기에_변수를_넣으세요'
  });`,
    tasks: [
      {
        id: 'problem1',
        description: "page_title에 document.title 변수 사용하기",
        validate: (events) => {
          const pv = findGa4Event(events, 'event', 'page_view');
          const args = pv?.args[1] || {};
          
          // MockRuntime environment makes document.title available
          const isCorrect = args.page_title === "장바구니 | MyShop";

          return { 
            passed: isCorrect, 
            message: isCorrect ? "성공" : `현재 제목("장바구니 | MyShop")과 다릅니다. 변수를 사용했나요?` 
          };
        }
      },
      {
        id: 'problem2',
        description: "page_location에 location.href 변수 사용하기",
        validate: (events) => {
          const pv = findGa4Event(events, 'event', 'page_view');
          const args = pv?.args[1] || {};
          const isCorrect = args.page_location === "https://www.myshop.com/cart";

          return { 
            passed: isCorrect, 
            message: isCorrect ? "성공" : "현재 URL 주소와 일치하지 않습니다." 
          };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO', { send_page_view: false });

  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: location.href
  });`
  }
];