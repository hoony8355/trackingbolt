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

  // 규칙(소문자, 언더바)을 지켜 이벤트를 전송하세요.`,
    references: [
      { label: "[GA4] 이벤트 이름 지정 규칙", url: "https://support.google.com/analytics/answer/13316687?hl=ko" },
      { label: "[GA4] 맞춤 이벤트", url: "https://support.google.com/analytics/answer/12229021?hl=ko" }
    ],
    faqs: [
      {
        question: "한글로 이벤트 이름을 지으면 안 되나요?",
        answer: "기술적으로는 가능하지만 권장하지 않습니다. 데이터 내보내기(BigQuery 등)나 다른 툴과 연동할 때 글자가 깨지거나 오류가 발생할 확률이 매우 높습니다."
      },
      {
        question: "띄어쓰기(공백)를 쓰면 어떻게 되나요?",
        answer: "GA4 보고서에서 공백이 자동으로 다른 문자로 치환되거나, 검색이 어려워질 수 있습니다. 가독성을 위해 언더바(_) 사용을 추천합니다."
      }
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
    hint: "gtag('event', 'click_main_banner');",
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

  // click_main_banner 이벤트에 파라미터를 추가하여 전송하세요.`,
    references: [
      { label: "[GA4] 이벤트 파라미터", url: "https://support.google.com/analytics/table/13594742?hl=ko" }
    ],
    faqs: [
      {
        question: "파라미터는 몇 개까지 보낼 수 있나요?",
        answer: "이벤트당 최대 25개까지 보낼 수 있습니다. 하지만 너무 많이 보내면 분석이 복잡해지므로 꼭 필요한 정보만 담는 것이 좋습니다."
      },
      {
        question: "파라미터 이름도 규칙이 있나요?",
        answer: "네, 이벤트 이름과 동일합니다. 소문자와 언더바를 사용해야 하며, 구글이 미리 정의한 이름(value, currency 등)을 우선 사용하는 것이 좋습니다."
      }
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
    hint: "세 번째 인자로 { promotion_name: 'summer_sale', promotion_id: 'ban_101' } 객체를 전달하세요.",
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  gtag('event', 'click_main_banner', {
    promotion_name: 'summer_sale',
    promotion_id: 'ban_101'
  });`
  },
  {
    id: 'ga4-p2-interaction',
    track: 'GA4',
    title: '8. 버튼을 누를 때만 실행하기 (Event Handler)',
    description: `
### 📘 개념 학습: 즉시 실행 vs 나중에 실행
지금까지 작성한 코드는 페이지가 열리자마자 바로 실행되었습니다.
하지만 **'장바구니 담기'** 이벤트는 페이지가 열릴 때가 아니라, **사용자가 버튼을 클릭했을 때** 전송되어야 합니다.

이럴 때 사용하는 것이 **함수(Function)**입니다. 함수는 코드를 보관해두는 **'대기실'**과 같습니다.
우리는 대기실 안에 코드를 넣어두고, HTML 버튼에게 이렇게 명령합니다.

> "버튼아, 사용자가 너를 클릭하면 저기 대기실(\`handleCartClick\`)에 있는 코드를 실행해줘!"

---

### 🎯 실습 가이드
아래 코드창에 함수 뼈대가 준비되어 있습니다.
빈칸을 채워 버튼 클릭 시 작동할 코드를 완성하세요.

1.  \`handleCartClick\` 함수 **안쪽에** \`add_to_cart\` 이벤트를 작성하세요.
2.  금액(\`value\`)은 **59000**, 통화(\`currency\`)는 **'KRW'**로 설정하세요.
3.  마지막 줄의 \`handleCartClick()\`은 테스트를 위해 우리가 강제로 버튼을 한 번 누른 척하는 코드입니다. 지우지 마세요.
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 👇 이 함수는 사용자가 [장바구니] 버튼을 클릭할 때 실행됩니다.
  window.handleCartClick = function() {
    console.log("장바구니 버튼 클릭됨!");
    
    // 여기에 gtag('event', 'add_to_cart', ... ) 코드를 작성하세요.


  };

  // 👇 테스트를 위해 강제로 한 번 실행해봅니다.
  handleCartClick();`,
    faqs: [
      {
        question: "왜 함수(function) 안에 넣어야 하나요?",
        answer: "함수 없이 코드를 작성하면 페이지가 로딩되는 순간 바로 실행되어버립니다. '클릭했을 때'만 실행되게 하려면 함수라는 '대기실'에 넣어두고 클릭 시점에 호출해야 합니다."
      },
      {
        question: "실제 웹사이트에서는 어떻게 적용하나요?",
        answer: "HTML 태그에 onclick 속성을 사용하거나 (<button onclick='handleCartClick()'>), 자바스크립트 addEventListener를 사용하여 버튼과 함수를 연결합니다."
      },
      {
        question: "마지막 줄의 handleCartClick()은 왜 필요한가요?",
        answer: "실제 사이트에서는 사용자가 클릭할 때까지 기다리지만, 여기서는 학습 시스템이 여러분의 코드가 잘 작동하는지 확인하기 위해 강제로 한 번 실행시켜보는 것입니다."
      }
    ],
    tasks: [
      {
        id: 'step3_click',
        description: "함수 안에서 'add_to_cart' 이벤트 보내기",
        validate: (events) => {
          const cart = findGa4Event(events, 'add_to_cart');
          if (!cart) {
             return { passed: false, message: "이벤트가 전송되지 않았습니다. 함수 내부를 작성했나요?" };
          }
          return { 
            passed: true, 
            message: "성공! 함수를 통해 이벤트가 전송되었습니다." 
          };
        }
      },
      {
        id: 'step3_params',
        description: "파라미터: value=59000, currency='KRW'",
        validate: (events) => {
          const cart = findGa4Event(events, 'add_to_cart');
          const args = cart?.args[1] || {};
          
          if (args.value !== 59000 || args.currency !== 'KRW') {
             return { passed: false, message: "금액(value)이나 통화(currency) 정보가 올바르지 않습니다." };
          }
          return { 
            passed: true, 
            message: "성공: 상세 정보가 포함되었습니다." 
          };
        }
      }
    ],
    hint: "함수 중괄호 { } 사이에 gtag 코드를 넣으세요.\ngtag('event', 'add_to_cart', { value: 59000, currency: 'KRW' });",
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

  // handleSignupClick 함수를 정의하고, sign_up 표준 이벤트를 전송하세요.
  `,
    references: [
      { label: "[GA4] 추천 이벤트", url: "https://support.google.com/analytics/answer/9267735?hl=ko" }
    ],
    faqs: [
      {
        question: "내 마음대로 이름을 지으면 안 되나요? (Custom Event)",
        answer: "가능합니다. 이것을 '맞춤 이벤트'라고 합니다. 하지만 구글이 자동으로 제공하는 보고서나 머신러닝 기능을 100% 활용하려면 표준 이벤트를 우선 사용하는 것이 유리합니다."
      },
      {
        question: "표준 이벤트 목록은 어디서 보나요?",
        answer: "구글 공식 문서(Google Help)에서 'GA4 추천 이벤트'를 검색하면 산업별(쇼핑몰, 게임 등) 추천 목록을 확인할 수 있습니다."
      }
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
    hint: "gtag('event', 'sign_up', { method: 'email' });",
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

  // 디버그 모드를 켜서 test_event를 전송하세요.`,
    references: [
      { label: "[GA4] DebugView에서 이벤트 모니터링하기", url: "https://support.google.com/analytics/answer/7201382?hl=ko" }
    ],
    faqs: [
      {
        question: "실제 운영 서버(Live)에 배포할 때는 어떻게 하나요?",
        answer: "반드시 debug_mode: true 코드를 삭제하고 배포해야 합니다. 그렇지 않으면 실제 고객 데이터가 보고서에서 누락될 수 있습니다."
      },
      {
        question: "Chrome 확장 프로그램(GA Debugger)을 써도 되나요?",
        answer: "네, Google Analytics Debugger 확장 프로그램을 켜면 자동으로 모든 이벤트에 debug_mode 신호가 붙습니다. 코드를 일일이 수정하지 않아도 되어 편리합니다."
      }
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
    hint: "gtag('event', 'test_event', { debug_mode: true });",
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  gtag('event', 'test_event', {
    debug_mode: true
  });`
  }
];