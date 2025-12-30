import { Lesson, TrackingEvent } from '../../types';

const findGa4Event = (events: TrackingEvent[], eventName: string) => {
  return events.find(e => e.type === 'GA4' && e.command === 'event' && e.args[0] === eventName);
};

export const ga4Phase3: Lesson[] = [
  {
    id: 'ga4-p3-sign-up',
    track: 'GA4',
    title: '11. 비즈니스의 첫 단추 (Sign Up)',
    description: `
### 📘 개념 학습: 가입 경로(Method)가 왜 중요할까요?
회원가입은 사용자가 우리 서비스에 **"내 정보를 줘도 좋다"**고 허락한 중요한 순간입니다.
마케터는 사용자가 **"카카오로 가입했는지, 이메일로 가입했는지"** 미치도록 궁금해합니다. 

**왜냐고요?** 
"카카오 간편가입 도입 후 가입 전환율이 20% 올랐다"는 가설을 증명해야 하기 때문입니다.
GA4의 표준 이벤트 \`sign_up\`은 \`method\` 파라미터를 통해 이를 구분할 것을 강력히 권장합니다.

---

### 🎯 실습 가이드
우측의 **[회원가입]** 버튼 클릭 핸들러를 구현하세요.
사용자가 '카카오(Kakao)'를 통해 가입했다고 가정합니다.

1. 표준 이벤트: \`sign_up\`
2. 파라미터: \`method\` 값을 \`'Kakao'\`로 설정
    `,
    preCode: `<button onclick="window.handleSignupClick()">회원가입</button>`,
    initialCode: `  // 회원가입 버튼 클릭 시 실행될 함수
  window.handleSignupClick = function() {
    
  };`,
    tasks: [
      {
        id: 'step11_event',
        description: "버튼 클릭 및 sign_up 이벤트 전송",
        validate: (events) => {
          return { passed: !!findGa4Event(events, 'sign_up'), message: "sign_up 이벤트가 없습니다. 버튼을 클릭했나요?" };
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
    solutionCode: `  window.handleSignupClick = function() {
    gtag('event', 'sign_up', {
      method: 'Kakao'
    });
  };`
  },
  {
    id: 'ga4-p3-login',
    track: 'GA4',
    title: '12. 재방문 사용자 인식 (Login)',
    description: `
### 📘 개념 학습: 가입과 로그인은 다르다
초보 개발자가 흔히 하는 실수 중 하나는 "로그인할 때마다 가입 이벤트를 보내는 것"입니다.
이렇게 되면 **신규 회원 수가 실제보다 부풀려져서** 회사의 성장 지표가 왜곡됩니다.

*   **sign_up**: 평생 딱 한 번만 발생 (신규 유입 측정용)
*   **login**: 방문할 때마다 발생 (DAU, 유저 충성도 측정용)

---

### 🎯 실습 가이드
사용자가 이메일로 로그인을 시도했습니다.
\`login\` 표준 이벤트를 전송하세요.

1. 이벤트명: \`login\`
2. 파라미터: \`method\` (\`'Email'\`)
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
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');
  gtag('event', 'login', { method: 'Email' });`
  },
  {
    id: 'ga4-p3-lead',
    track: 'GA4',
    title: '13. 가치 있는 행동 (Generate Lead)',
    description: `
### 📘 개념 학습: 돈이 되지 않아도 가치는 있다
쇼핑몰이 아닌 보험 상담, 견적 문의 사이트에서는 '구매'가 일어나지 않습니다.
대신 **"상담 신청(DB 제출)"**이 매출과 직결된 핵심 행동입니다.

이런 행동을 **리드(Lead)**라고 부릅니다.
GA4에서는 \`generate_lead\` 이벤트를 사용하여 잠재 고객 확보를 추적합니다.
이때, 이 행동이 대략 얼마의 가치가 있는지(\`value\`)를 함께 보내면 **ROAS(광고 수익률)** 계산이 가능해집니다.

---

### 🎯 실습 가이드
사용자가 예상 가치 50,000원짜리 상담을 신청했습니다.
1. 이벤트명: \`generate_lead\`
2. 파라미터: \`value\` (50000), \`currency\` ('KRW')
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
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  gtag('event', 'generate_lead', {
    value: 50000,
    currency: 'KRW'
  });`
  },
  {
    id: 'ga4-p3-view-item',
    track: 'GA4',
    title: '14. 커머스 퍼널 1: 상품 조회 (View Item)',
    description: `
### 📘 개념 학습: items 배열의 등장
전자상거래(E-commerce) 분석의 핵심은 **"어떤 상품을"** 봤는지 아는 것입니다.
GA4는 이를 위해 모든 커머스 이벤트(조회-장바구니-결제)에 **\`items\`** 라는 배열([])을 넣도록 강제합니다.

**items가 중요한 이유:**
사용자가 어떤 상품을 많이 보는지, 그리고 **어떤 상품을 보고 이탈하는지** 분석하기 위해서입니다.

\`items\` 배열 안에는 상품 객체가 들어갑니다.
*   \`item_id\`: 상품 고유 코드 (필수 - 재고 관리 코드와 일치해야 함)
*   \`item_name\`: 상품명 (필수)
*   \`price\`: 가격

---

### 🎯 실습 가이드
우측 화면에 보이는 '프리미엄 겨울 코트'를 사용자가 조회 중입니다.
1. 이벤트명: \`view_item\`
2. 파라미터 \`items\` 배열 안에 아래 상품 정보를 담아 보내세요.
   * ID: \`coat_2024\`
   * Name: \`Premium Winter Coat\`
   * Price: \`59000\`
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 상품 조회 이벤트
  gtag('event', 'view_item', {
    currency: 'KRW',
    value: 59000,
    items: [
      // 이곳에 상품 객체를 추가하세요.
      {
        
      }
    ]
  });`,
    tasks: [
      {
        id: 'step14_array',
        description: "items 배열에 상품 정보 포함",
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
        description: "상품 ID, 이름, 가격 정보 확인",
        validate: (events) => {
          const evt = findGa4Event(events, 'view_item');
          const item = evt?.args[1]?.items?.[0] || {};
          
          if (item.item_id !== 'coat_2024') return { passed: false, message: "item_id가 틀렸습니다." };
          if (item.price !== 59000) return { passed: false, message: "price가 틀렸습니다." };
          
          return { passed: true, message: "상품 데이터가 정확합니다." };
        }
      }
    ],
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
    title: '15. 커머스 퍼널 2: 장바구니 (Add to Cart)',
    description: `
### 📘 개념 학습: 데이터의 지속성
사용자가 상품 상세페이지(\`view_item\`)에서 마음이 움직여 **[장바구니 담기]** 버튼을 눌렀습니다.
이때 발생하는 \`add_to_cart\` 이벤트는 방금 전 조회했던 상품 정보를 **그대로 유지**해야 합니다.

**퍼널(Funnel) 분석의 핵심:**
"상품 조회 대비 장바구니 전환율"을 계산하려면, 상품 ID가 조회 단계와 장바구니 단계에서 **정확히 동일**해야 합니다. ID가 \`coat_2024\` 였다가 \`coat_2024_ver2\`로 바뀌면, GA4는 이를 서로 다른 상품으로 인식하여 연결 고리가 끊어집니다.

---

### 🎯 실습 가이드
우측의 **[장바구니 담기]** 버튼 핸들러를 구현하세요.
(이전 레슨과 동일한 상품 정보 \`coat_2024\`를 사용합니다.)

1. 함수: \`window.handleCartClick\`
2. 이벤트명: \`add_to_cart\`
3. \`items\` 배열 필수 포함
    `,
    preCode: `<button onclick="window.handleCartClick()">장바구니 담기</button>`,
    initialCode: `  window.handleCartClick = function() {
    // 여기에 코드를 작성하세요.
    
  };`,
    tasks: [
      {
        id: 'step15_click',
        description: "버튼 클릭 및 add_to_cart 이벤트 전송",
        validate: (events) => {
          return { passed: !!findGa4Event(events, 'add_to_cart'), message: "이벤트 미감지. 버튼을 클릭해보세요." };
        }
      },
      {
        id: 'step15_items',
        description: "items 배열 및 상품 ID 유지 확인",
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
  };`
  }
];