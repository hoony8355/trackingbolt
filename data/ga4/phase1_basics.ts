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
    id: 'ga4-p0-why',
    track: 'GA4',
    title: '0. 데이터가 없으면 비즈니스는 도박이다',
    description: `
### 💡 왜 이 공부를 해야 할까요?
여러분이 월 1,000만 원을 써서 쇼핑몰 광고를 했습니다.
방문자는 많은데, 정작 **매출은 0원**입니다.

*   광고 문구가 별로였나?
*   상세 페이지 사진이 안 예쁜가?
*   결제 버튼이 고장 났나?

**트래킹(Tracking)**이 없다면, 이 질문에 답을 할 수 없습니다. 감으로 "다음엔 잘되겠지" 하며 또 돈을 쓰는 건 도박입니다.

### 👨‍💻 코드는 '통역사'입니다
고객이 웹사이트에서 하는 행동(클릭, 스크롤, 구매)을 **GA4가 알아들을 수 있는 언어**로 번역해주는 것이 여러분이 배울 코드(\`gtag\`)입니다.

---

### 🎯 워밍업 미션
GA4에게 "**나 이제 공부 시작해!**" 라고 첫 인사를 건네봅시다.
\`tutorial_begin\`이라는 단어를 사용하면 GA4가 알아듣습니다.

1. 코드창에 \`gtag('event', 'tutorial_begin');\` 을 입력하세요.
2. **[▶ 코드 실행 & 검증]** 버튼을 누르세요.
    `,
    preCode: `<script>
  // Google Analytics 4 라이브러리가 로드된 상태입니다.
</script>`,
    initialCode: `// 아래에 코드를 직접 입력하세요.`,
    postCode: ``,
    faqs: [
      {
        question: "마케터가 코드를 꼭 알아야 하나요?",
        answer: "직접 코딩을 하지 않더라도, 개발자에게 '어떤 데이터를 어떻게 수집해달라'고 정확히 요청하려면 기본 문법과 구조를 이해해야 합니다."
      },
      {
        question: "GA4는 무료인가요?",
        answer: "네, 대부분의 중소/중견 기업이 사용하는 표준 버전은 무료입니다. (엔터프라이즈급인 GA4 360은 유료입니다.)"
      }
    ],
    tasks: [
      {
        id: 'start_evt',
        description: "tutorial_begin 이벤트 전송하기",
        validate: (events) => {
          const hasEvent = findGa4Event(events, 'event', 'tutorial_begin');
          return { passed: !!hasEvent, message: hasEvent ? "신호 수신 성공! 이제 본격적으로 시작해봅시다." : "이벤트가 감지되지 않았습니다." };
        }
      }
    ],
    hint: "gtag('event', 'tutorial_begin');",
    solutionCode: `  gtag('event', 'tutorial_begin');`
  },
  {
    id: 'ga4-p1-config',
    track: 'GA4',
    title: '1. GA4 연결하기 (Config)',
    description: `
### 📡 개념 학습: 로그인과 비슷합니다
여러분이 인스타그램에 사진을 올리려면 먼저 **로그인**을 해야 하죠?
GA4도 마찬가지입니다. 코드를 사용하기 전에 "**이 데이터는 내 계정(G-XXXX)에 쌓아줘**" 라고 알려주는 절차가 필요합니다.

이것을 **초기화(Config)** 라고 부릅니다.
웹사이트의 모든 페이지에는 항상 이 코드가 가장 먼저 실행되어야 합니다.

\`\`\`javascript
// 문법: gtag('config', '내_측정_ID');
gtag('config', 'G-TRACK-DEMO');
\`\`\`

---

### 📝 실습 가이드
1. 측정 ID \`G-TRACK-DEMO\`를 사용하여 GA4에 연결하세요.
2. 코드를 작성하고 **[▶ 코드 실행 & 검증]**을 누르세요.
    `,
    preCode: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TRACK-DEMO"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());`,
    initialCode: `// 여기에 config 코드를 작성하세요.`,
    postCode: `</script>`,
    faqs: [
      {
        question: "측정 ID(G-XXXX)는 어디서 확인하나요?",
        answer: "GA4 관리자 페이지 > 데이터 스트림 설정 메뉴에서 확인할 수 있습니다. UA-로 시작하는 것은 구버전(Universal Analytics) ID이므로 주의하세요."
      },
      {
        question: "이 코드는 웹사이트 어디에 넣어야 하나요?",
        answer: "HTML의 <head> 태그 내에서도 가능한 가장 위쪽에 배치하는 것이 좋습니다. 그래야 방문자가 들어오자마자 데이터를 놓치지 않고 잡을 수 있습니다."
      }
    ],
    tasks: [
      {
        id: 'problem1',
        description: "config 명령어로 ID 'G-TRACK-DEMO' 연결하기",
        validate: (events) => {
          const hasConfig = findGa4Event(events, 'config', 'G-TRACK-DEMO');
          if (!hasConfig) {
            const wrongConfig = findGa4Event(events, 'config');
            if (wrongConfig) return { passed: false, message: `ID가 다릅니다. 입력된 ID: ${wrongConfig.args[0]}` };
            return { passed: false, message: "config 명령어가 발견되지 않았습니다." };
          }
          return { passed: true, message: "GA4 연결 성공!" };
        }
      }
    ],
    hint: "gtag('config', 'G-TRACK-DEMO');",
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');`
  },
  {
    id: 'ga4-p1-auto-pv',
    track: 'GA4',
    title: '2. 데이터 눈으로 확인하기 (Debugging)',
    description: `
### 📡 개념 학습: 보냈으면 확인해야죠!
택배를 보냈으면 배송 조회를 하듯이, 데이터를 보냈으면 **잘 도착했는지** 확인해야 합니다.
개발자 도구(DevTools)를 볼 줄 모르면, 잘못된 데이터가 쌓여도 영영 모르게 됩니다.

**참고:**
우리가 방금 작성한 \`config\` 코드가 실행되면, GA4는 "아, 방문자가 왔구나!"라고 판단하고 자동으로 \`page_view\`(페이지 조회) 이벤트를 기록합니다.

---

### 📝 실습 가이드
이번에는 코드를 작성한 뒤, **결과 패널을 보는 법**을 익혀봅시다.

1. \`config\` 코드를 작성하고 실행하세요.
2. 실행 후, 하단 패널의 **[Stream]** 탭을 눌러보세요.
3. 자동으로 생성된 \`page_view\`가 보이면 성공입니다.
    `,
    initialCode: `// GA4 초기화 코드를 다시 한 번 작성해보세요.`,
    references: [
      { label: "[GA4] 자동 수집 이벤트", url: "https://support.google.com/analytics/answer/9234069?hl=ko" }
    ],
    faqs: [
      {
        question: "실제 사이트에서 데이터를 실시간으로 보려면 어떻게 하나요?",
        answer: "GA4 보고서 메뉴의 '실시간(Realtime)' 탭이나, 설정 > DebugView 메뉴를 통해 내 행동이 찍히는지 확인할 수 있습니다."
      },
      {
        question: "데이터가 바로바로 안 떠요.",
        answer: "GA4 무료 버전은 데이터 처리에 지연이 발생할 수 있습니다. DebugView는 비교적 빠르지만(초 단위), 일반 보고서는 최대 24-48시간이 걸릴 수 있습니다."
      }
    ],
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
        description: "하단 [Stream] 탭에서 page_view 확인하기",
        validate: (events) => {
          const hasPV = findGa4Event(events, 'page_view') || findGa4Event(events, 'event', 'page_view'); 
          return { passed: !!hasPV, message: hasPV ? "자동 수집 이벤트 감지됨 (성공)" : "config가 정상 실행되면 자동으로 뜹니다." };
        }
      }
    ],
    hint: "gtag('config', 'G-TRACK-DEMO');",
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');`
  },
  {
    id: 'ga4-p1-pv-disable',
    track: 'GA4',
    title: '3. 깜빡임 없는 사이트의 문제점 (SPA)',
    description: `
### 📡 개념 학습: 왜 자동 수집을 꺼야 하나요?
옛날 사이트들은 페이지를 넘길 때마다 화면이 하얗게 깜빡(새로고침)거렸습니다. GA4는 이 "**깜빡임**"을 세서 조회수를 측정합니다.

하지만 요즘 쇼핑몰(React, Vue로 만든)은 앱처럼 부드럽게 화면이 바뀝니다. **깜빡임이 없으니 GA4는 페이지가 바뀐 줄 모릅니다.**
그래서 고객이 쇼핑을 계속해도 조회수는 1(처음 접속)에 멈춰있게 됩니다.

이 문제를 해결하기 위해 "**GA4야, 네가 알아서 세지 마. 내가 필요할 때마다 직접 알려줄게**" 라고 설정을 바꿔야 합니다.

\`\`\`javascript
gtag('config', 'ID', {
  send_page_view: false  // "자동으로 보내지 마!"
});
\`\`\`
    `,
    initialCode: `// 자동 페이지 뷰 수집을 끄는 옵션을 추가하여 config를 작성하세요.`,
    faqs: [
      {
        question: "SPA(Single Page Application)가 뭔가요?",
        answer: "React, Vue, Angular 등으로 만든 최신 웹사이트입니다. 페이지 이동 시 전체를 새로고침하지 않고 필요한 부분만 갈아끼우기 때문에 속도가 빠르지만, GA4 기본 설정으로는 페이지 변경을 감지하지 못합니다."
      },
      {
        question: "그냥 '향상된 측정'의 페이지 변경 감지를 켜면 안 되나요?",
        answer: "GA4 설정에서 '브라우저 방문 기록 이벤트를 기반으로 페이지 변경사항 변경'을 켜도 되지만, 개발자가 시점을 100% 통제하기 위해 자동 수집을 끄고 수동(Manual)으로 보내는 방식을 선호하기도 합니다."
      }
    ],
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
        description: "Stream 탭에 page_view가 없어야 성공",
        validate: (events) => {
           const hasPV = findGa4Event(events, 'page_view') || findGa4Event(events, 'event', 'page_view'); 
           return { passed: !hasPV, message: !hasPV ? "성공: 불필요한 자동 이벤트 차단됨" : "실패: 여전히 page_view가 전송되고 있습니다." };
        }
      }
    ],
    hint: "gtag('config', 'G-TRACK-DEMO', { send_page_view: false });",
    solutionCode: `  gtag('config', 'G-TRACK-DEMO', {
    send_page_view: false
  });`
  },
  {
    id: 'ga4-p1-pv-manual-static',
    track: 'GA4',
    title: '4. 수동으로 신호 보내기 (Manual Event)',
    description: `
### 📡 개념 학습: 이제 내가 직접 셉니다
자동 기능을 껐으니, 이제 페이지가 바뀔 때마다 **개발자가 직접** "**지금 페이지 봤어!**"라고 GA4에 신호를 보내야 합니다.

이때 사용하는 명령어가 \`event\` 입니다.
가장 기본이 되는 \`page_view\` 신호를 수동으로 보내봅시다.

### 🔑 문법: 여러 정보를 한 번에 보내기
이벤트 이름 뒤에 **중괄호 \`{ }\`**를 열고, 상세 정보를 담을 수 있습니다.
정보가 여러 개일 때는 **쉼표 \`,\`**로 구분합니다.

\`\`\`javascript
gtag('event', 'page_view', {
  page_title: '장바구니',        // 첫 번째 정보
  page_referrer: 'https://nav.er' // 두 번째 정보 (쉼표 필수!)
});
\`\`\`

---

### 📝 실습 가이드
1. 자동 수집 끄기 설정은 이미 되어있습니다.
2. \`event\` 명령어를 사용해 \`page_view\`를 직접 전송하세요.
3. 파라미터로 다음 두 가지 정보를 함께 보내세요.
    *   **page_title**: '겨울 코트 특가전'
    *   **page_referrer**: 'https://naver.com'
    `,
    initialCode: `  // 1. 자동 수집 끄기 (작성됨)
  gtag('config', 'G-TRACK-DEMO', { send_page_view: false });

  // 2. 수동으로 page_view 이벤트 전송 (직접 작성해보세요)
  `,
    references: [
      { label: "[GA4] 이벤트 정보", url: "https://support.google.com/analytics/answer/9322688?hl=ko" }
    ],
    faqs: [
      {
        question: "page_referrer가 무엇인가요?",
        answer: "사용자가 이 페이지에 오기 직전에 머물렀던 주소입니다. 네이버 검색을 타고 왔는지, 인스타그램 광고를 보고 왔는지 분석할 때 필수적인 정보입니다."
      },
      {
        question: "파라미터 순서가 중요한가요?",
        answer: "아니요, 중괄호 {} 안에서는 순서가 상관없습니다. 쉼표(,)로 구분만 잘 해주시면 됩니다."
      }
    ],
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
        description: "파라미터1: page_title='겨울 코트 특가전'",
        validate: (events) => {
          const pv = findGa4Event(events, 'event', 'page_view');
          const args = pv?.args[1] || {};
          
          if (args.page_title !== '겨울 코트 특가전') return { passed: false, message: "page_title이 요구사항과 다릅니다." };

          return { 
            passed: true, 
            message: "성공" 
          };
        }
      },
      {
        id: 'problem3',
        description: "파라미터2: page_referrer='https://naver.com'",
        validate: (events) => {
          const pv = findGa4Event(events, 'event', 'page_view');
          const args = pv?.args[1] || {};
          
          if (args.page_referrer !== 'https://naver.com') return { passed: false, message: "page_referrer가 요구사항과 다릅니다. (쉼표 확인)" };

          return { 
            passed: true, 
            message: "성공" 
          };
        }
      }
    ],
    hint: "gtag('event', 'page_view', { \n  page_title: '겨울 코트 특가전', \n  page_referrer: 'https://naver.com' \n});",
    solutionCode: `  gtag('config', 'G-TRACK-DEMO', { send_page_view: false });

  gtag('event', 'page_view', {
    page_title: '겨울 코트 특가전',
    page_referrer: 'https://naver.com'
  });`
  },
  {
    id: 'ga4-p1-pv-manual-dynamic',
    track: 'GA4',
    title: '5. 스마트한 복사/붙여넣기 (Dynamic Variables)',
    description: `
### 📡 개념 학습: 일일이 타이핑하지 마세요
쇼핑몰 상품이 10,000개라고 해봅시다.
각 페이지마다 코드에 \`'겨울 코트'\`, \`'여름 바지'\` 라고 일일이 한글로 적어넣는 건 불가능합니다.

대신 "**지금 화면에 떠있는 제목을 가져와**" 라는 명령어를 써야 합니다.
이것을 **동적 변수(Dynamic Variable)**라고 합니다.

*   \`document.title\`: 현재 브라우저 탭의 제목을 읽어옵니다.
*   \`location.href\`: 현재 주소창의 URL을 읽어옵니다.

이렇게 짜두면, 코드 한 줄로 10,000개 페이지를 모두 정확하게 추적할 수 있습니다.

---

### 📝 실습 가이드
고정된 글자 대신, 자바스크립트 변수(\`document.title\`, \`location.href\`)를 사용하여 코드를 완성하세요.
    `,
    preCode: `<script>
  // [가상 브라우저 환경]
  // 현재 제목: "장바구니 | MyShop"
  // 현재 주소: "https://www.myshop.com/cart"
</script>`,
    initialCode: `  gtag('config', 'G-TRACK-DEMO', { send_page_view: false });

  // 변수를 사용하여 page_view 이벤트를 전송하세요.`,
    faqs: [
      {
        question: "다른 유용한 변수들은 어떤 게 있나요?",
        answer: "`location.pathname`(도메인을 제외한 경로), `document.referrer`(이전 페이지 주소) 등이 자주 사용됩니다."
      },
      {
        question: "변수값이 비어있으면 어떻게 되나요?",
        answer: "빈 문자열(\"\")이나 undefined로 전송됩니다. 이 경우 GA4 보고서에서 `(not set)`으로 표시될 수 있으므로, 개발 단계에서 값이 잘 들어오는지 확인해야 합니다."
      }
    ],
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
            message: isCorrect ? "성공" : `직접 타이핑하셨나요? 변수(document.title)를 사용해보세요.` 
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
    hint: "따옴표 없이 변수명을 그대로 값에 넣으세요.\n예: page_title: document.title",
    solutionCode: `  gtag('config', 'G-TRACK-DEMO', { send_page_view: false });

  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: location.href
  });`
  }
];