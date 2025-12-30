import { Lesson, TrackingEvent } from '../../types';

const findGa4Event = (events: TrackingEvent[], eventName: string) => {
  return events.find(e => e.type === 'GA4' && e.command === 'event' && e.args[0] === eventName);
};

export const ga4Phase2: Lesson[] = [
  {
    id: 'ga4-p2-event-custom',
    track: 'GA4',
    title: '6. 이름 짓기의 기술 (Custom Events)',
    description: `
### 📘 개념 학습: 자유와 책임
GA4는 매우 유연합니다. 여러분이 \`my_super_click\`이라고 보내면, GA4는 군말 없이 받아줍니다.
하지만 팀원 모두가 제멋대로 이름을 짓기 시작하면 데이터는 쓰레기가 됩니다.

**개발자가 지켜야 할 Naming Convention (권장)**:
1.  **영문 소문자**만 사용하세요. (대문자 X)
2.  공백 대신 **언더바(\`_\`)**를 사용하세요. (Snake Case)
3.  \`동사_명사\` 순서가 가독성이 좋습니다. (예: \`click_banner\`)

---

### 🎯 실습 가이드
사용자가 메인 배너를 클릭했습니다.
규칙을 준수하여 **커스텀 이벤트**를 전송하세요.
(구체적인 조건은 미션 탭을 확인하세요)
    `,
    initialCode: `  // GA4 설정
  gtag('config', 'G-TRACK-DEMO');

  // [문제] 'BannerClick'은 잘못된 예시입니다. 올바른 이름으로 수정하세요.
  gtag('event', 'BannerClick');
  `,
    tasks: [
      {
        id: 'step1',
        description: "작명 규칙(Snake Case)을 지켜 'click_main_banner' 전송하기",
        validate: (events) => {
          const hasWrong = findGa4Event(events, 'BannerClick') || findGa4Event(events, 'click banner');
          const hasCorrect = findGa4Event(events, 'click_main_banner');
          
          if (hasWrong) return { passed: false, message: "대문자나 공백은 권장되지 않습니다. Snake Case를 사용하세요." };
          return { passed: !!hasCorrect, message: hasCorrect ? "성공: 깔끔한 이름입니다." : "이벤트가 전송되지 않았습니다." };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');
  gtag('event', 'click_main_banner');`
  },
  {
    id: 'ga4-p2-event-params',
    track: 'GA4',
    title: '7. 6하원칙 적용하기 (Event Parameters)',
    description: `
### 📘 개념 학습: 이벤트의 "맥락(Context)"
"배너 클릭함"이라는 정보만으로는 부족합니다.
마케터는 **"어떤 배너?"**, **"몇 번째 배너?"**, **"어디로 가는 배너?"**인지 궁금해합니다.

이벤트 이름이 **제목**이라면, 파라미터(Parameter)는 **본문**입니다.
객체 \`{ key: value }\` 형태로 무제한의 정보를 담을 수 있습니다.

---

### 🎯 실습 가이드
이전 레슨의 \`click_main_banner\` 이벤트에 상세 정보를 추가하세요.
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 파라미터를 추가하여 이벤트를 풍성하게 만드세요.
  gtag('event', 'click_main_banner', {
    
  });`,
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
        description: "파라미터 포함: promotion_name='summer_sale', promotion_id='ban_101'",
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
    title: '8. 반응형 코드 작성 (Event Handler)',
    description: `
### 📘 개념 학습: 실행 시점의 차이
지금까지 작성한 코드는 페이지가 로드되자마자 실행되었습니다.
하지만 실제 웹사이트에서는 **사용자가 버튼을 클릭하는 순간**에 코드가 실행되어야 합니다.

이를 위해 코드를 함수(Function) 안에 가두고, 버튼이 클릭될 때 그 함수를 호출해야 합니다.
우측 미리보기 화면의 **[장바구니 담기]** 버튼은 클릭 시 \`handleCartClick()\` 함수를 찾도록 설계되어 있습니다.

---

### 🎯 실습 가이드
1. \`window.handleCartClick\` 함수를 완성하세요.
2. 코드를 실행하고, **우측 가상 브라우저의 [장바구니 담기] 버튼을 직접 클릭**해야 검증됩니다.
    `,
    preCode: `<!-- 버튼 HTML 예시 -->
<button onclick="window.handleCartClick()">장바구니 담기</button>`,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 1. 함수 정의하기
  window.handleCartClick = function() {
    console.log("버튼 클릭됨!");
    
    // 2. 여기에 gtag 코드 작성
    
  };`,
    tasks: [
      {
        id: 'step3_click',
        description: "버튼 클릭 시 'add_to_cart' 이벤트 전송하기",
        validate: (events) => {
          const cart = findGa4Event(events, 'add_to_cart');
          if (!cart) {
             return { passed: false, message: "아직 이벤트가 감지되지 않았습니다. 코드를 실행하고 버튼을 클릭해보세요." };
          }
          return { 
            passed: true, 
            message: "성공! 사용자의 행동에 반응했습니다." 
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
  };`
  },
  {
    id: 'ga4-p2-standard-event',
    track: 'GA4',
    title: '9. 구글이 좋아하는 표준 (Standard Events)',
    description: `
### 📘 개념 학습: 표준어 쓰기
Lesson 6에서 \`click_main_banner\` 같은 커스텀 이벤트를 만들었습니다.
하지만 '회원가입', '로그인', '구매' 처럼 모든 사이트에 공통으로 존재하는 행동들은 구글이 미리 정해둔 **표준 이름(Standard Event)**을 쓰는 것이 유리합니다.

**표준 이벤트를 쓰면 좋은 점:**
*   GA4가 "아, 이거 회원가입이네?"라고 바로 알아듣습니다.
*   별도의 설정 없이 보고서에 예쁘게 분류됩니다.
*   구글의 머신러닝이 데이터를 더 잘 학습합니다.

**주요 표준 이벤트:** \`sign_up\`, \`login\`, \`purchase\`, \`share\`, \`search\`

---

### 🎯 실습 가이드
우측 상단 **[회원가입]** 링크를 클릭했을 때 실행될 코드입니다.
표준 이름과 파라미터를 사용하여 코드를 작성하세요.
    `,
    preCode: `<button onclick="window.handleSignupClick()">회원가입</button>`,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  window.handleSignupClick = function() {
    // 커스텀 이름(join_done 등) 대신 표준 이름을 사용하세요.
    
  };`,
    tasks: [
      {
        id: 'std_evt_name',
        description: "회원가입 클릭 시 표준 이름 'sign_up' 전송하기",
        validate: (events) => {
          const evt = findGa4Event(events, 'sign_up');
          return { passed: !!evt, message: evt ? "표준 이벤트 감지됨" : "우측 상단 '회원가입'을 클릭하세요." };
        }
      },
      {
        id: 'std_evt_param',
        description: "가입 방식 파라미터 포함: method='email'",
        validate: (events) => {
           const evt = findGa4Event(events, 'sign_up');
           return { 
             passed: evt?.args[1]?.method === 'email', 
             message: "가입 방식(method) 정보가 필요합니다." 
           };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  window.handleSignupClick = function() {
    gtag('event', 'sign_up', {
      method: 'email'
    });
  };`
  },
  {
    id: 'ga4-p2-debug-mode',
    track: 'GA4',
    title: '10. 개발자의 안전장치 (Debug Mode)',
    description: `
### 📘 개념 학습: 데이터 오염 방지
여러분이 개발 중에 테스트 삼아 보낸 "100억 원 구매" 데이터가 실제 경영 보고서에 섞이면 어떤 일이 벌어질까요?
회사의 월간 매출 데이터 신뢰도가 바닥으로 떨어지게 됩니다.

이를 막기 위해 GA4는 **DebugView**라는 격리 구역을 제공합니다.
이벤트 파라미터에 \`debug_mode: true\`를 추가하면, 해당 데이터는 **실제 보고서(Reports) 집계에서 제외**되고 오직 개발자용 디버그 화면에만 나타납니다.

**💡 실무 팁**: 
개발 환경(localhost)에서는 항상 이 옵션이 켜지도록 코드를 짜는 것이 좋습니다.

---

### 🎯 실습 가이드
안전한 테스트를 위해 디버그 모드 옵션을 활성화하여 이벤트를 전송하세요.
(이벤트 이름은 자유롭게 정해도 좋으나, \`test_event\`를 권장합니다.)
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 디버그 모드를 켜서 안전하게 이벤트를 보내세요.
  gtag('event', 'test_event', {
    
  });`,
    tasks: [
      {
        id: 'debug_check',
        description: "debug_mode: true 파라미터가 포함되어야 함",
        validate: (events) => {
          // Find any event with debug_mode: true
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