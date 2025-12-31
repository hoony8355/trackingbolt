import { Lesson, TrackingEvent } from '../../types';

const findGa4Event = (events: TrackingEvent[], eventName: string) => {
  return events.find(e => e.type === 'GA4' && e.command === 'event' && e.args[0] === eventName);
};

export const ga4Phase4: Lesson[] = [
  {
    id: 'ga4-p4-purchase-basic',
    track: 'GA4',
    title: '16. 영수증 번호 챙기기 (Purchase)',
    description: `
### 📘 개념 학습: 매출 뻥튀기 방지법
사용자가 **"결제 완료" 페이지에서 새로고침**을 하면 어떻게 될까요?
코드가 또 실행되면서 매출 5만 원이 10만 원, 15만 원으로 계속 중복되어 잡힐 수 있습니다.

이걸 막으려면 GA4에게 "**이건 영수증 번호 12345번 거래야**" 라고 알려줘야 합니다.
GA4는 같은 영수증 번호(\`transaction_id\`)가 또 들어오면 "아, 아까 처리한 거네" 하고 무시합니다.

**핵심 규칙:**
*   \`purchase\` 이벤트에는 반드시 \`transaction_id\`(주문번호)가 있어야 한다.

---

### 🎯 실습 가이드
매출 확정 신호를 보내세요.

1. 이벤트명: \`purchase\`
2. 주문번호: \`transaction_id: 'ORDER_12345'\`
3. 금액: \`value: 59000\`
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 구매 이벤트를 전송하세요.
  gtag('event', 'purchase', {
    
  });`,
    tasks: [
      {
        id: 'step16_tid',
        description: "transaction_id (주문번호) 필수 포함",
        validate: (events) => {
          const evt = findGa4Event(events, 'purchase');
          const tid = evt?.args[1]?.transaction_id;
          return { passed: !!tid && tid === 'ORDER_12345', message: "주문번호(transaction_id)가 누락되었거나 틀립니다." };
        }
      },
      {
        id: 'step16_val',
        description: "value, currency 설정",
        validate: (events) => {
          const evt = findGa4Event(events, 'purchase');
          const args = evt?.args[1] || {};
          return { 
            passed: args.value === 59000 && args.currency === 'KRW', 
            message: "매출액(value)과 통화(currency)를 정확히 입력하세요." 
          };
        }
      }
    ],
    solutionCode: `  gtag('config', 'G-TRACK-DEMO');

  gtag('event', 'purchase', {
    transaction_id: 'ORDER_12345',
    value: 59000,
    currency: 'KRW'
  });`
  },
  {
    id: 'ga4-p4-purchase-items',
    track: 'GA4',
    title: '17. [심화] 여러 개 샀을 때 (Multi Items)',
    description: `
### 📘 개념 학습: 장바구니 털기
현실세계에서 사용자는 한 번에 여러 상품을 구매합니다.
양말(5,000원)과 코트(59,000원)를 샀다면, **총 결제 금액**(\`value\`)은 **합계인 64,000원**이 되어야 합니다.

만약 총 금액은 64,000원인데, 상품 목록(\`items\`)에는 양말 하나만 들어있다면?
데이터가 앞뒤가 안 맞게 되어 신뢰도가 떨어집니다.

---

### 🎯 실습 가이드
두 가지 상품을 구매한 상황을 코드로 작성하세요.
1. 상품 A: ID \`SOCKS_001\`, 가격 \`5000\`
2. 상품 B: ID \`COAT_2024\`, 가격 \`59000\`
3. \`value\`는 두 가격의 합계로 설정하세요.
    `,
    initialCode: `  gtag('event', 'purchase', {
    transaction_id: 'ORDER_999',
    currency: 'KRW',
    // 문제 1: value를 계산해서 넣으세요.
    value: 0, 
    items: [
      // 문제 2: 상품 2개를 추가하세요.
    ]
  });`,
    tasks: [
      {
        id: 'step17_val',
        description: "value 합계 검증 (64000)",
        validate: (events) => {
          const evt = findGa4Event(events, 'purchase');
          return { passed: evt?.args[1]?.value === 64000, message: "총 금액이 맞지 않습니다." };
        }
      },
      {
        id: 'step17_items',
        description: "items 배열에 상품 2개 포함",
        validate: (events) => {
          const evt = findGa4Event(events, 'purchase');
          const items = evt?.args[1]?.items;
          return { 
            passed: Array.isArray(items) && items.length === 2, 
            message: "상품이 2개여야 합니다." 
          };
        }
      }
    ],
    solutionCode: `  gtag('event', 'purchase', {
    transaction_id: 'ORDER_999',
    currency: 'KRW',
    value: 64000,
    items: [
      { item_id: 'SOCKS_001', item_name: 'Socks', price: 5000 },
      { item_id: 'COAT_2024', item_name: 'Coat', price: 59000 }
    ]
  });`
  }
];