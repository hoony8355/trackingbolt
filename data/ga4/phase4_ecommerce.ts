import { Lesson, TrackingEvent } from '../../types';

const findGa4Event = (events: TrackingEvent[], eventName: string) => {
  return events.find(e => e.type === 'GA4' && e.command === 'event' && e.args[0] === eventName);
};

export const ga4Phase4: Lesson[] = [
  {
    id: 'ga4-p4-purchase-basic',
    track: 'GA4',
    title: '16. 트래킹의 꽃, 구매 (Purchase)',
    description: `
### 📘 개념 학습: 결제는 단 한 번만!
\`purchase\` 이벤트는 회사 매출과 직결되므로 가장 신중하게 다뤄야 합니다.
가장 흔한 사고는 사용자가 **결제 완료 페이지를 새로고침** 할 때마다 매출이 중복으로 잡히는 것입니다.

이를 막기 위해 GA4는 **\`transaction_id\`(거래 고유 ID)**를 요구합니다.
GA4는 이미 수집된 \`transaction_id\`가 또 들어오면, "아, 이건 아까 받은 거네" 하고 **자동으로 무시(Deduplication)**합니다.

---

### 🎯 실습 가이드
구매 완료 페이지에 도달했습니다. 매출 확정 신호를 보내세요.

1. 이벤트명: \`purchase\`
2. **필수 파라미터 3대장**:
   * \`transaction_id\`: \`'ORDER_12345'\`
   * \`value\`: \`59000\`
   * \`currency\`: \`'KRW'\`
3. (이번 실습에서는 items 배열은 생략하거나 비워도 좋습니다)
    `,
    initialCode: `  gtag('config', 'G-TRACK-DEMO');

  // 구매 이벤트를 전송하세요.
  gtag('event', 'purchase', {
    
  });`,
    tasks: [
      {
        id: 'step16_tid',
        description: "transaction_id 포함 (중복 방지 핵심)",
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
    title: '17. [심화] 복합 구매 추적 (Multi Items)',
    description: `
### 📘 개념 학습: 장바구니 털기
현실세계에서 사용자는 한 번에 여러 상품을 구매합니다.
양말(5,000원)과 코트(59,000원)를 샀다면, \`value\`는 합계인 64,000원이 되어야 하고, \`items\` 배열에는 두 개의 객체가 들어가야 합니다.

데이터 정합성(Consistency)을 위해:
**총합(value) = 각 상품 가격(price) × 수량(quantity)의 합** 이어야 합니다.

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