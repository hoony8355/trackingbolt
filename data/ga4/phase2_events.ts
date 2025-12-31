import { Lesson, TrackingEvent } from '../../types';

const findGa4Event = (events: TrackingEvent[], eventName: string) => {
  return events.find(e => e.type === 'GA4' && e.command === 'event' && e.args[0] === eventName);
};

export const ga4Phase2: Lesson[] = [
  {
    id: 'ga4-p2-event-custom',
    track: 'GA4',
    title: '6. 이름 짓기 규칙 (Naming Convention)',
    description: `
### 📘 개념 학습: 도서관의 분류 규칙
도서관에서 어떤 책은 "소설", 어떤 책은 "Novel", 어떤 책은 "fiction"이라고 제멋대로 분류되어 있다면 책을 찾을 수 있을까요?
GA4 데이터도 마찬가지입니다.

개발자와 마케터가 약속된 규칙으로 이벤트 이름을 지어야 나중에 데이터를 분석할 때 헷갈리지 않습니다.

**국룰(권장 규칙):**
1.  **소문자만 쓴다.** (대문자 금지)
2.  **언더바**(\`_\`)를 쓴다. (띄어쓰기 대신)
3.  \`동사_명사\` **순서로 쓴다.** (예: \`click_banner\`)

---

### 🎯 실습 가이드
사용자가 메인 배너를 클릭했습니다.
위 규칙을 지켜서 '**메인 배너 클릭**' 이벤트를 전송하세요.
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // [문제] 'BannerClick'은 나쁜 예시입니다. 올바른 규칙으로 고쳐주세요.
  gtag('event', 'BannerClick');
  `,
    references: [
      { label: "[GA4] 이벤트 이름 지정 규칙", url: "https://support.google.com/analytics/answer/13316687?hl=ko" },
      { label: "[GA4] 맞춤 이벤트", url: "https://support.google.com/analytics/answer/12229021?hl=ko" }
    ],
    tasks: [
      {
        id: 'step1',
        description: "규칙(소문자, 언더바)을 지켜 'click_main_banner' 전송하기",
        validate: (events) => {
          const hasWrong = findGa4Event(events, 'BannerClick') || findGa4Event(events, 'click banner');
          const hasCorrect = findGa4Event(events, 'click_main_banner');
          
          if (hasWrong) return { passed: false, message: "대문자나 띄어쓰기는 피해주세요. (예: click_main_banner)" };
          return { passed: !!hasCorrect, message: hasCorrect ? "성공: 아주 깔끔한 이름입니다." : "이벤트가 전송되지 않았습니다." };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');
  gtag('event', 'click_main_banner');`
  },
  {
    id: 'ga4-p2-event-params',
    track: 'GA4',
    title: '7. 포스트잇 붙이기 (Event Parameters)',
    description: `
### 📘 개념 학습: 상자 속의 내용물
이벤트 이름(\`click_main_banner\`)이 **택배 상자**라면, 파라미터는 상자 안에 들어있는 **내용물**입니다.

"배너 클릭했어!"라고만 하면, 마케터는 "**그래서 무슨 배너? 여름 세일 배너? 아니면 신상품 배너?**"라고 되물을 것입니다.
이때 상자 안에 쪽지(Parameter)를 넣어서 보내주면 됩니다.

\`\`\`javascript
gtag('event', '이벤트명', {
  '쪽지_제목': '쪽지_내용',
  'promotion_name': 'summer_sale'
});
\`\`\`

---

### 🎯 실습 가이드
\`click_main_banner\` 이벤트 상자 안에 상세 정보를 담은 쪽지(파라미터)를 추가하세요.
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 중괄호 { } 안에 상세 정보를 적어주세요.
  gtag('event', 'click_main_banner', {
    
  });`,
    references: [
      { label: "[GA4] 이벤트 파라미터", url: "https://support.google.com/analytics/table/13594742?hl=ko" }
    ],
    tasks: [
      {
        id: 'step2_evt',
        description: "이벤트명: click_main_banner",
        validate: (events) => {
          return { passed: !!findGa4Event(events, 'click_main_banner'), message: "이벤트명을 확인하세요." };
        }
      },
      {
        id: 'step2_params',
        description: "파라미터: promotion_name='summer_sale', promotion_id='ban_101'",
        validate: (events) => {
          const evt = findGa4Event(events, 'click_main_banner');
          const args = evt?.args[1] || {};
          
          if (args.promotion_name !== 'summer_sale') return { passed: false, message: "promotion_name이 틀렸습니다." };
          if (args.promotion_id !== 'ban_101') return { passed: false, message: "promotion_id가 틀렸습니다." };

          return { 
            passed: true, 
            message: "성공: 상세 데이터가 포함되었습니다." 
          };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  gtag('event', 'click_main_banner', {
    promotion_name: 'summer_sale',
    promotion_id: 'ban_101'
  });`
  },
  {
    id: 'ga4-p2-interaction',
    track: 'GA4',
    title: '8. 클릭할 때까지 대기! (Event Handler)',
    description: `
### 📘 개념 학습: 대기실(Function) 만들기
지금까지 작성한 코드는 "실행" 버튼을 누르자마자 전송되었습니다.
하지만 실제 쇼핑몰에서는 **고객이 장바구니 버튼을 눌렀을 때** 전송되어야 합니다.

그래서 우리는 코드를 바로 실행하지 않고, **함수(Function)**라는 대기실 안에 가둬둘 겁니다.
"이 버튼을 누르면 그때 대기실 문을 열고 나가!" 라고 명령하는 것이죠.

---

### 🎯 실습 가이드
1. \`handleCartClick\`이라는 대기실(함수)을 만드세요.
2. 그 안에 \`add_to_cart\` 코드를 작성하세요.
3. 마지막 줄에서 \`handleCartClick()\`을 **직접 호출**하여, 버튼이 클릭된 상황을 흉내 내보세요.
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 1. 함수(대기실) 만들기
  window.handleCartClick = function() {
    console.log("장바구니 버튼 클릭됨!");
    // 2. 여기에 gtag 코드를 넣으세요 ('add_to_cart', value: 59000, currency: 'KRW')
    
  };

  // 3. 테스트를 위해 강제로 클릭 상황 만들기 (함수 호출)
  handleCartClick();
  `,
    tasks: [
      {
        id: 'step3_click',
        description: "함수 안에서 'add_to_cart' 이벤트 보내기",
        validate: (events) => {
          const cart = findGa4Event(events, 'add_to_cart');
          if (!cart) {
             return { passed: false, message: "이벤트가 감지되지 않았습니다. 함수 밖에서 handleCartClick()을 호출했나요?" };
          }
          return { 
            passed: true, 
            message: "성공! 함수를 통해 이벤트가 전송되었습니다." 
          };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  window.handleCartClick = function() {
    gtag('event', 'add_to_cart', {
      currency: 'KRW',
      value: 59000
    });
  };

  handleCartClick();`
  },
  {
    id: 'ga4-p2-standard-event',
    track: 'GA4',
    title: '9. 구글이 아는 단어 쓰기 (Standard Events)',
    description: `
### 📘 개념 학습: 구글의 사전
여러분이 회원가입 이벤트를 \`join_start\`라고 보내고, 옆 회사는 \`new_member\`라고 보낸다면?
구글 AI는 이 둘이 같은 행동인지 모릅니다.

그래서 구글은 "**회원가입은 앞으로 \`sign_up\`이라고 부르자**"라고 표준 단어를 정해두었습니다.
이 표준 단어(Standard Event)를 사용하면, 별다른 설정 없이도 GA4 보고서에 예쁘게 분류되어 나옵니다.

**자주 쓰는 표준 단어:**
*   \`sign_up\` (회원가입)
*   \`login\` (로그인)
*   \`purchase\` (구매)
*   \`search\` (검색)

---

### 🎯 실습 가이드
회원가입 상황입니다. 구글 표준 단어를 사용하여 코드를 작성하세요.

1. 함수명: \`handleSignupClick\`
2. 표준 이벤트명: \`sign_up\`
3. 파라미터: \`method: 'email'\` (이메일로 가입함)
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  window.handleSignupClick = function() {
    // 여기에 표준 이벤트를 작성하세요.
    
  };

  handleSignupClick(); // 실행
  `,
    references: [
      { label: "[GA4] 추천 이벤트", url: "https://support.google.com/analytics/answer/9267735?hl=ko" }
    ],
    tasks: [
      {
        id: 'std_evt_name',
        description: "표준 이름 'sign_up' 사용하기",
        validate: (events) => {
          const evt = findGa4Event(events, 'sign_up');
          return { passed: !!evt, message: evt ? "표준 이벤트 감지됨" : "함수를 정의하고 호출(call)하세요." };
        }
      },
      {
        id: 'std_evt_param',
        description: "가입 방법(method='email') 알려주기",
        validate: (events) => {
           const evt = findGa4Event(events, 'sign_up');
           return { 
             passed: evt?.args[1]?.method === 'email', 
             message: "method 파라미터가 필요합니다." 
           };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  window.handleSignupClick = function() {
    gtag('event', 'sign_up', {
      method: 'email'
    });
  };
  
  handleSignupClick();`
  },
  {
    id: 'ga4-p2-debug-mode',
    track: 'GA4',
    title: '10. 연습용 데이터 표시하기 (Debug Mode)',
    description: `
### 📘 개념 학습: 연습장과 시험지 구분하기
여러분이 지금 테스트로 보내는 데이터가 실제 회사 매출 잡히면 큰일 나겠죠?
(사장님: "어? 오늘 매출 100억 늘었네?" -> 알고 보니 개발자 테스트)

그래서 개발할 때는 데이터에 "**이건 연습용이야**" 라는 꼬리표를 붙여야 합니다.
그 꼬리표가 바로 \`debug_mode: true\` 입니다.
이게 붙어있으면 GA4는 실제 보고서에 합산하지 않고, 따로 'DebugView'라는 곳에서만 보여줍니다.

---

### 🎯 실습 가이드
안전한 테스트를 위해 디버그 모드 꼬리표를 붙여서 이벤트를 전송하세요.
(이벤트 이름: \`test_event\`)
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 디버그 모드를 켜서 안전하게 이벤트를 보내세요.
  gtag('event', 'test_event', {
    
  });`,
    references: [
      { label: "[GA4] DebugView에서 이벤트 모니터링하기", url: "https://support.google.com/analytics/answer/7201382?hl=ko" }
    ],
    tasks: [
      {
        id: 'debug_check',
        description: "debug_mode: true 파라미터 포함",
        validate: (events) => {
          const debugEvent = events.find(e => 
            e.type === 'GA4' && 
            e.command === 'event' && 
            e.args[1]?.debug_mode === true
          );
          
          if (!debugEvent) return { passed: false, message: "debug_mode: true 파라미터가 발견되지 않았습니다." };
          return { passed: true, message: "성공: 이 데이터는 실제 보고서에서 제외됩니다." };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  gtag('event', 'test_event', {
    debug_mode: true
  });`
  }
];