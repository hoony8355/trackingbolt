import { Lesson, TrackingEvent } from '../../types';

const findGa4Event = (events: TrackingEvent[], eventName: string) => {
  return events.find(e => e.type === 'GA4' && e.command === 'event' && e.args[0] === eventName);
};

export const ga4Phase3: Lesson[] = [
  {
    id: 'ga4-p3-sign-up',
    track: 'GA4',
    title: '11. 어떻게 가입했니? (Sign Up Method)',
    description: `
### 📘 개념 학습: 마케터의 질문 의도
마케팅 팀장님이 개발자에게 묻습니다.
"이번에 카카오 간편가입 붙이고 나서 가입자 늘었어?"

이 질문에 대답하려면 코드를 짤 때 **'어떤 방법으로 가입했는지'**를 꼬리표(파라미터)로 붙여줘야 합니다.
GA4는 \`sign_up\` 이벤트에 \`method\`라는 꼬리표를 붙이기를 강력히 권장합니다.

---

### 🎯 실습 가이드
사용자가 '카카오(Kakao)' 버튼을 눌러 가입했습니다.
1. 이벤트명: \`sign_up\`
2. 파라미터: \`method: 'Kakao'\`
    `,
    preCode: `<!-- 카카오 로그인 버튼 예시 -->
<button onclick="handleSignupClick()">카카오로 시작하기</button>`,
    initialCode: `  // 회원가입 함수와 이벤트를 작성하세요.
  `,
    tasks: [
      {
        id: 'step11_event',
        description: "sign_up 이벤트 전송",
        validate: (events) => {
          return { passed: !!findGa4Event(events, 'sign_up'), message: "sign_up 이벤트가 없습니다. 함수를 호출했나요?" };
        }
      },
      {
        id: 'step11_param',
        description: "method: 'Kakao' 파라미터 확인",
        validate: (events) => {
          const evt = findGa4Event(events, 'sign_up');
          return { 
            passed: evt?.args[1]?.method === 'Kakao', 
            message: "method 파라미터가 'Kakao'여야 합니다." 
          };
        }
      }
    ],
    hint: "window.handleSignupClick = function() { ... } 안에서 gtag를 호출하고, 마지막 줄에서 함수를 실행하세요.",
    solutionCode: `  window.handleSignupClick = function() {
    gtag('event', 'sign_up', {
      method: 'Kakao'
    });
  };
  handleSignupClick();`
  },
  {
    id: 'ga4-p3-login',
    track: 'GA4',
    title: '12. 신규인가 재방문인가 (Login)',
    description: `
### 📘 개념 학습: 가입과 로그인 구분하기
초보 개발자가 흔히 하는 실수: "로그인할 때도 \`sign_up\`(가입) 이벤트를 보낸다."

이렇게 되면, 어제 가입한 사람이 오늘 로그인할 때 **또 신규 가입자**로 카운트됩니다.
회원 수는 1명인데, 데이터상으로는 매일 신규 회원이 늘어나는 기적(?)이 일어납니다.

*   **sign_up**: 평생 딱 한 번 (신규)
*   **login**: 들어올 때마다 (재방문)

---

### 🎯 실습 가이드
사용자가 이메일로 로그인을 시도했습니다.
\`login\` 표준 이벤트를 전송하세요. (파라미터: \`method: 'Email'\`)
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 로그인 이벤트를 전송하세요.
  `,
    tasks: [
      {
        id: 'step12_event',
        description: "login 표준 이벤트 사용",
        validate: (events) => {
          const evt = findGa4Event(events, 'login');
          return { passed: !!evt, message: "login 이벤트 확인" };
        }
      },
      {
        id: 'step12_param',
        description: "method: 'Email' 파라미터 확인",
        validate: (events) => {
          const evt = findGa4Event(events, 'login');
          return { 
            passed: evt?.args[1]?.method === 'Email', 
            message: "로그인 방식(method)이 지정되지 않았습니다." 
          };
        }
      }
    ],
    hint: "gtag('event', 'login', { method: 'Email' });",
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');
  gtag('event', 'login', { method: 'Email' });`
  },
  {
    id: 'ga4-p3-lead',
    track: 'GA4',
    title: '13. 돈이 될 뻔한 행동 (Generate Lead)',
    description: `
### 📘 개념 학습: 잠재 고객(Lead)
보험 상담, 자동차 시승 신청, 인테리어 견적 문의...
이런 사이트들은 당장 결제가 일어나지 않습니다. 대신 "**상담 신청**"이 가장 중요합니다.

이런 행동을 마케팅 용어로 **리드(Lead)**라고 합니다.
상담 신청 1건당 평균적으로 50,000원의 수익 효과가 있다고 가정하고, GA4에 \`value: 50000\`을 보내주면 광고 효율을 계산할 수 있습니다.

---

### 🎯 실습 가이드
사용자가 상담 신청을 완료했습니다.
1. 이벤트명: \`generate_lead\`
2. 가치: \`value: 50000\`
3. 통화: \`currency: 'KRW'\` (원화)
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 리드 생성 이벤트를 작성하세요.
  `,
    tasks: [
      {
        id: 'step13_event',
        description: "generate_lead 이벤트 전송",
        validate: (events) => {
          return { passed: !!findGa4Event(events, 'generate_lead'), message: "generate_lead 확인" };
        }
      },
      {
        id: 'step13_value',
        description: "가치(50000)와 통화(KRW) 설정",
        validate: (events) => {
          const evt = findGa4Event(events, 'generate_lead');
          const args = evt?.args[1] || {};
          return { 
            passed: args.value === 50000 && args.currency === 'KRW', 
            message: "value 또는 currency 파라미터가 정확하지 않습니다." 
          };
        }
      }
    ],
    hint: "value는 숫자 50000, currency는 문자열 'KRW' 입니다.",
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  gtag('event', 'generate_lead', {
    value: 50000,
    currency: 'KRW'
  });`
  },
  {
    id: 'ga4-p3-view-item',
    track: 'GA4',
    title: '14. 상품 이름표 붙이기 (View Item)',
    description: `
### 📘 개념 학습: items 배열
"고객이 상품을 봤다"는 사실도 중요하지만, "**어떤 상품을 봤냐**"가 더 중요합니다.
그래야 "이 코트를 본 사람이 저 바지도 많이 사더라" 같은 추천 알고리즘을 만들 수 있으니까요.

GA4는 상품 정보를 담을 때 \`items\`라는 전용 바구니(배열)를 쓰라고 강제합니다.
이 바구니 안에는 상품의 주민등록번호(\`item_id\`), 이름(\`item_name\`), 가격(\`price\`)이 들어있어야 합니다.

---

### 🎯 실습 가이드
사용자가 '프리미엄 겨울 코트'를 보고 있습니다.
\`view_item\` 이벤트 안의 \`items\` 바구니를 채워주세요.

*   ID: \`coat_2024\`
*   Name: \`Premium Winter Coat\`
*   Price: \`59000\`
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 상품 조회(view_item) 이벤트를 작성하고, items 배열을 완성하세요.
  `,
    tasks: [
      {
        id: 'step14_array',
        description: "items 배열 확인",
        validate: (events) => {
          const evt = findGa4Event(events, 'view_item');
          const items = evt?.args[1]?.items;
          return { 
            passed: Array.isArray(items) && items.length > 0, 
            message: "items는 배열([])이어야 하며 상품이 하나 이상 있어야 합니다." 
          };
        }
      },
      {
        id: 'step14_data',
        description: "ID, 이름, 가격 정보 확인",
        validate: (events) => {
          const evt = findGa4Event(events, 'view_item');
          const item = evt?.args[1]?.items?.[0] || {};
          
          if (item.item_id !== 'coat_2024') return { passed: false, message: "item_id가 틀렸습니다." };
          if (item.price !== 59000) return { passed: false, message: "price가 틀렸습니다." };
          
          return { passed: true, message: "상품 데이터가 정확합니다." };
        }
      }
    ],
    hint: "파라미터 객체 안에 items: [ { item_id: '...', ... } ] 형태로 작성하세요.",
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  gtag('event', 'view_item', {
    currency: 'KRW',
    value: 59000,
    items: [
      {
        item_id: 'coat_2024',
        item_name: 'Premium Winter Coat',
        price: 59000
      }
    ]
  });`
  },
  {
    id: 'ga4-p3-add-to-cart',
    track: 'GA4',
    title: '15. 장바구니까지 따라가기 (Add to Cart)',
    description: `
### 📘 개념 학습: 데이터의 일관성
방금 본 코트(\`coat_2024\`)를 장바구니에 담았습니다.
그런데 장바구니 이벤트에서는 갑자기 ID를 \`coat_new_ver\`라고 바꿔서 보내면 어떻게 될까요?

GA4는 "**어? 아까 본 거랑 다른 물건이네?**" 라고 생각합니다.
상품 조회 → 장바구니 담기 비율(전환율)을 계산할 수 없게 되죠.

그래서 **상품 ID는 쇼핑의 모든 단계에서 절대 변하면 안 됩니다.**

---

### 🎯 실습 가이드
장바구니 담기 핸들러를 작성하세요. 
이전 레슨과 **똑같은 상품 ID**(\`coat_2024\`)를 사용해야 합니다.
    `,
    initialCode: `  // 장바구니 버튼 클릭 함수(handleCartClick)를 작성하세요.
  // add_to_cart 이벤트와 items 정보를 포함해야 합니다.
  `,
    tasks: [
      {
        id: 'step15_click',
        description: "add_to_cart 이벤트 전송",
        validate: (events) => {
          return { passed: !!findGa4Event(events, 'add_to_cart'), message: "이벤트 미감지. 함수를 호출했나요?" };
        }
      },
      {
        id: 'step15_items',
        description: "이전 단계와 동일한 item_id 사용",
        validate: (events) => {
          const evt = findGa4Event(events, 'add_to_cart');
          const item = evt?.args[1]?.items?.[0] || {};
          return { 
            passed: item.item_id === 'coat_2024', 
            message: "이전 단계와 동일한 item_id('coat_2024')여야 합니다." 
          };
        }
      }
    ],
    hint: "이전 레슨 코드에서 이벤트 이름만 'add_to_cart'로 바꾸면 됩니다.",
    solutionCode: `  window.handleCartClick = function() {
    gtag('event', 'add_to_cart', {
      currency: 'KRW',
      value: 59000,
      items: [
        {
          item_id: 'coat_2024',
          item_name: 'Premium Winter Coat',
          price: 59000,
          quantity: 1
        }
      ]
    });
  };
  handleCartClick();`
  }
];