import { Lesson, TrackingEvent } from '../../types';

const findGa4Event = (events: TrackingEvent[], eventName: string) => {
  return events.find(e => e.type === 'GA4' && e.command === 'event' && e.args[0] === eventName);
};

export const ga4Phase5: Lesson[] = [
  {
    id: 'ga4-p5-pitfalls',
    track: 'GA4',
    title: 'Phase 5. 실무 포인트 (Step 23-27)',
    description: `
### Step 23~25. 중복 방지와 조건문
결제 완료 페이지(\`/complete\`)가 아닌 곳에서 새로고침을 했다가 구매 이벤트가 또 날아가는 사고가 빈번합니다.
조건문을 통해 방어 로직을 세워야 합니다.

### Step 26. 테스트 모드
개발 중인 결제(\`testMode = true\`)가 실제 데이터에 섞이면 안 됩니다.

### Step 27. 콘솔 디버깅
\`console.log\`를 활용해 이벤트가 실행되는 시점을 추적하는 습관을 들이세요.

### 🎯 미션
아래 조건을 만족하는 방어 로직을 작성하세요.
1. \`location.pathname\`이 \`/complete\` 일 때만 실행.
2. \`console.log('purchase fired')\`를 찍어서 확인.
3. 구매 이벤트를 전송. (파라미터는 간단히)
    `,
    setupScript: `
      // Mock 환경 설정
      location.pathname = '/complete';
    `,
    preCode: `<script>
  // 현재 페이지: /complete
</script>`,
    initialCode: `  // if 조건문을 사용하여 안전하게 코드를 작성하세요.
  `,
    faqs: [
      {
        question: "프론트엔드에서 막는 것만으로 충분한가요?",
        answer: "아니요, 브라우저 환경은 변수가 많습니다. 가장 확실한 방법은 서버(백엔드)에서 GA4 Measurement Protocol을 사용해 결제 성공 신호를 직접 보내는 것입니다."
      },
      {
        question: "console.log는 배포할 때 지워야 하나요?",
        answer: "네, 불필요한 로그는 성능에 영향을 주거나 보안 정보를 노출할 수 있으므로, 실제 운영(Production) 환경에서는 제거하는 것이 좋습니다."
      }
    ],
    tasks: [
      {
        id: 'step24',
        description: "올바른 경로(/complete) 조건문 작성",
        validate: (events) => {
          return { passed: !!findGa4Event(events, 'purchase'), message: "이벤트가 전송되지 않았습니다. 경로 조건을 확인하세요." };
        }
      },
      {
        id: 'step27',
        description: "console.log 출력 확인",
        validate: (events) => {
           // Check if any event is of type 'Console' and command 'log'
           const hasLog = events.some(e => e.type === 'Console' && e.command === 'log');
           return { passed: hasLog, message: hasLog ? "로그 출력 확인됨." : "console.log('purchase fired'); 코드가 실행되지 않았습니다." }; 
        }
      }
    ],
    hint: "if (location.pathname === '/complete') { ... }",
    solutionCode: `  if (location.pathname === '/complete') {
    console.log('purchase fired');
    gtag('event', 'purchase', { transaction_id: 'test' });
  }`
  },
  {
    id: 'ga4-p5-final',
    track: 'GA4',
    title: 'Phase 5. [최종 과제] 완벽한 구매 추적 (Step 30)',
    description: `
### Step 30. 주니어 최종 실습 과제

지금까지 배운 모든 내용을 종합하여 완벽한 구매 코드를 작성하세요.

### 📋 요구사항
1. 이벤트명: \`purchase\`
2. 필수 파라미터: \`transaction_id\`, \`value\`, \`currency\`
3. 상품(\`items\`) 2개 이상 포함
4. 각 상품은 \`item_id\`, \`item_name\`, \`price\` 포함
5. (선택) 콘솔 로그 출력
    `,
    initialCode: `  // 상품 데이터 예시
  const myItems = [
    { id: 'p1', name: 'Socks', price: 5000 },
    { id: 'p2', name: 'Gloves', price: 15000 }
  ];

  // 여기에 최종 코드를 작성하세요.
  `,
    faqs: [
      {
        question: "데이터가 GA4와 내부 DB가 100% 일치할 수 있나요?",
        answer: "현실적으로 어렵습니다. 사용자 브라우저의 광고 차단(AdBlock), 네트워크 오류 등으로 인해 통상 5~10% 정도의 오차는 발생할 수 있음을 감안해야 합니다."
      }
    ],
    tasks: [
      {
        id: 'final_basic',
        description: "purchase 이벤트 및 필수 파라미터(ID, 금액, 통화)",
        validate: (events) => {
          const evt = findGa4Event(events, 'purchase');
          const a = evt?.args[1] || {};
          return { 
            passed: a.transaction_id && a.value && a.currency, 
            message: "필수 파라미터 누락" 
          };
        }
      },
      {
        id: 'final_items',
        description: "상품 2개 이상의 상세 정보",
        validate: (events) => {
          const evt = findGa4Event(events, 'purchase');
          const items = evt?.args[1]?.items;
          const valid = Array.isArray(items) && items.length >= 2 && items[0].item_id && items[0].price;
          return { passed: valid, message: "items 배열 구조 및 상품 데이터 확인" };
        }
      }
    ],
    hint: "items: myItems (단, myItems 내부 속성명을 GA4 표준인 item_id, item_name으로 매핑해서 넣어야 합니다)",
    solutionCode: `  const myItems = [
    { item_id: 'p1', item_name: 'Socks', price: 5000, quantity: 1 },
    { item_id: 'p2', item_name: 'Gloves', price: 15000, quantity: 1 }
  ];

  console.log('Sending Purchase...');
  
  gtag('event', 'purchase', {
    transaction_id: 'ORD-' + Math.floor(Math.random() * 1000),
    value: 20000,
    currency: 'KRW',
    items: myItems
  });`
  }
];