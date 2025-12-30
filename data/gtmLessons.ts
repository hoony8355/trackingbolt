import { Lesson } from '../types';

export const gtmLessons: Lesson[] = [
  // ==========================================
  // Lesson 0: Intro
  // ==========================================
  {
    id: 'gtm-intro',
    track: 'GTM',
    title: '0. 프롤로그: 마케터와 개발자의 평화 협정',
    description: `
# GTM(Google Tag Manager)이란?

과거에는 마케팅 도구 하나를 추가할 때마다 개발자가 코드를 수정하고 재배포해야 했습니다.
GTM은 이 과정을 획기적으로 줄여주는 **컨테이너(Container)**입니다.

### 핵심 원리: Data Layer (데이터 레이어)
GTM 학습의 90%는 **Data Layer**를 이해하는 것입니다.
*   **개발자:** 웹사이트의 중요 정보(가격, 상품명, 로그인 여부)를 \`dataLayer\`라는 우편함에 넣습니다. (\`push\`)
*   **GTM:** 우편함을 감시하다가 새 편지가 오면 자동으로 마케팅 툴(GA4, Facebook, Ads)로 발송합니다.

즉, 개발자는 **GTM 내부 설정을 몰라도 됩니다.** 단지 데이터를 **올바른 형식으로 밀어 넣어주기만(Push)** 하면 됩니다.

---
### 🎯 워밍업 미션
GTM 학습을 시작하는 의미로, \`gtm_tutorial_start\`라는 이벤트를 데이터 레이어에 밀어 넣어봅시다.
    `,
    preCode: `// window.dataLayer 배열은 GTM이 로드될 때 자동 생성되거나,
// 개발자가 미리 선언해둡니다.
window.dataLayer = window.dataLayer || [];`,
    initialCode: `// 아래 코드를 실행하여 데이터 레이어에 이벤트를 push 하세요.
dataLayer.push({
  'event': 'gtm_tutorial_start'
});`,
    postCode: ``,
    tasks: [
      {
        id: 't1',
        description: "dataLayer에 'gtm_tutorial_start' 이벤트 push 하기",
        validate: (events) => {
          const hasPush = events.some(e => e.type === 'GTM' && e.args[0].event === 'gtm_tutorial_start');
          return { passed: hasPush, message: hasPush ? "데이터 레이어 수신 확인됨!" : "push 버튼을 눌러보세요." };
        }
      }
    ],
    solutionCode: `dataLayer.push({
  'event': 'gtm_tutorial_start'
});`
  },

  {
    id: 'gtm-l1',
    track: 'GTM',
    title: '1. 데이터 레이어의 이해',
    description: `
# 개발자와 마케터의 우편함, Data Layer

구글 태그 관리자(GTM)는 웹사이트 코드와 마케팅 도구 사이의 '중개자'입니다.
GTM은 웹사이트 내부를 직접 들여다보는 대신, **Data Layer(데이터 레이어)**라는 특별한 공간만 감시합니다.

개발자가 정보를 **Data Layer에 밀어 넣으면(push)**, GTM이 그것을 낚아채서 GA4나 페이스북으로 쏘는 구조입니다.

### 핵심 문법
\`\`\`javascript
dataLayer.push({
  'event': '이벤트_이름',
  '변수명': '값'
});
\`\`\`

*   **dataLayer**: 정보를 담는 전역 배열(Queue)입니다.
*   **push**: 정보를 추가하는 명령어입니다.
*   **event**: GTM에게 "지금 무슨 일이 일어났어!"라고 알려주는 트리거 키워드입니다.

---

### 🎯 실습 목표
가상 브라우저에서 '회원가입'이 완료된 시점입니다.
GTM에게 이 사실을 알려주세요.

1.  \`dataLayer.push\` 함수를 사용하세요.
2.  \`event\` 키값은 \`sign_up_complete\`로 설정하세요.
3.  \`userId\`라는 변수에 \`user_999\`라는 값을 함께 보내세요.
    `,
    initialCode: `// window.dataLayer는 이미 선언되어 있습니다.
// 회원가입 완료 정보를 GTM으로 밀어넣으세요(push).

`,
    tasks: [
       {
        id: 't1',
        description: "dataLayer.push를 호출하세요.",
        validate: (events) => {
          const hasPush = events.some(e => e.type === 'GTM' && e.command === 'push');
          return { passed: hasPush, message: hasPush ? "push 호출됨." : "push 함수가 호출되지 않았습니다." };
        }
      },
      {
        id: 't2',
        description: "'event': 'sign_up_complete'를 포함하세요.",
        validate: (events) => {
           const push = events.find(e => e.type === 'GTM' && e.args[0].event === 'sign_up_complete');
           return { passed: !!push, message: !!push ? "이벤트 키 확인됨." : "GTM은 'event' 키를 보고 트리거를 작동시킵니다." };
        }
      },
       {
        id: 't3',
        description: "'userId': 'user_999' 데이터를 함께 보내세요.",
        validate: (events) => {
           const push = events.find(e => e.type === 'GTM' && e.args[0].userId === 'user_999');
           return { passed: !!push, message: !!push ? "변수 데이터 확인됨." : "userId 데이터가 누락되었습니다." };
        }
      }
    ],
    solutionCode: `dataLayer.push({
  'event': 'sign_up_complete',
  'userId': 'user_999'
});`
  },
  {
    id: 'gtm-l2',
    track: 'GTM',
    title: '2. 전자상거래 데이터 레이어',
    description: `
# GTM을 통한 전자상거래

GA4에서 직접 \`gtag\`를 쓸 때와 달리, GTM을 쓸 때는 \`dataLayer.push\` 안에 **ecommerce**라는 특정 구조의 객체를 담아 보내야 합니다.
구글이 정해놓은 이 약속된 구조(Schema)를 지켜야 GTM이 자동으로 상품 정보를 인식합니다.

### GA4용 표준 데이터 레이어 구조
\`\`\`javascript
dataLayer.push({
  'event': 'add_to_cart',
  'ecommerce': {
    'currency': 'KRW',
    'value': 15000,
    'items': [
       // 상품 정보...
    ]
  }
});
\`\`\`

---

### 🎯 실습 목표
사용자가 장바구니에 상품을 담았습니다.

1.  이벤트 이름은 \`add_to_cart\`입니다.
2.  \`ecommerce\` 객체 안에 데이터를 담아야 합니다.
3.  \`ecommerce\` 내부에 \`value\`(가격)를 **15000**으로 설정하세요.
    `,
    initialCode: `// 장바구니 담기 이벤트를 구현하세요.
dataLayer.push({
  
});`,
    tasks: [
      {
        id: 't1',
        description: "이벤트 이름은 'add_to_cart' 여야 합니다.",
        validate: (events) => {
           const push = events.find(e => e.type === 'GTM' && e.args[0].event === 'add_to_cart');
           return { passed: !!push, message: "이벤트명 확인됨." };
        }
      },
      {
        id: 't2',
        description: "'ecommerce' 객체 구조를 사용하세요.",
        validate: (events) => {
           const push = events.find(e => e.type === 'GTM' && e.args[0].ecommerce);
           return { passed: !!push, message: !!push ? "ecommerce 객체 발견." : "데이터는 ecommerce 객체 안에 있어야 합니다." };
        }
      },
      {
        id: 't3',
        description: "ecommerce 내부에 value: 15000을 설정하세요.",
        validate: (events) => {
           const push = events.find(e => e.type === 'GTM' && e.args[0].ecommerce?.value === 15000);
           return { passed: !!push, message: "가격 데이터 확인됨." };
        }
      }
    ],
    solutionCode: `dataLayer.push({
  'event': 'add_to_cart',
  'ecommerce': {
    'value': 15000,
    'currency': 'KRW'
  }
});`
  }
];
