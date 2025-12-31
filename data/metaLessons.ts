import { Lesson } from '../types';

export const metaLessons: Lesson[] = [
  // ==========================================
  // Lesson 0: Intro
  // ==========================================
  {
    id: 'meta-intro',
    track: 'Meta',
    title: '0. 프롤로그: 광고 성과의 연료, 픽셀',
    description: `
# 메타(페이스북/인스타그램) 픽셀의 목적

"그냥 광고 보고 들어온 사람 숫자 세는 거 아니야?" 라고 생각하신다면 오산입니다.
메타 픽셀의 진짜 목적은 **AI 알고리즘 학습**입니다.

### 머신러닝의 연료
여러분이 \`Purchase\`(구매) 이벤트를 메타에게 보내주면, 메타의 AI는 이렇게 생각합니다.
> "아하! 이런 특성을 가진 사람이 물건을 사는구나. 그럼 **이와 비슷한 사람(Lookalike)**을 찾아서 광고를 보여줘야지."

즉, 개발자가 픽셀을 정확하게 심어줄수록 **광고 비용은 줄어들고 매출은 늘어납니다.**
여러분의 코드가 회사의 ROAS(광고비 대비 매출액)를 결정합니다.

---
### 🎯 워밍업 미션
메타 픽셀 학습을 시작해봅시다.
\`fbq\`(Facebook Query) 함수를 사용하여 가볍게 \`Contact\`(문의) 이벤트를 날려보세요.
    `,
    preCode: `<!-- Meta Pixel Code 로드 상태 -->
<script>
  !function(f,b,e,v,n,t,s) { ... }(window, document,'script',...);
</script>`,
    initialCode: `// fbq 함수를 사용해 Contact 이벤트를 보내보세요.`,
    postCode: ``,
    faqs: [
      {
        question: "픽셀이 잘 설치됐는지 어떻게 아나요?",
        answer: "크롬 확장 프로그램 'Meta Pixel Helper'를 설치하면, 현재 웹사이트에서 작동 중인 픽셀 ID와 이벤트를 녹색 불빛으로 확인할 수 있습니다."
      },
      {
        question: "앱(App)은 어떻게 추적하나요?",
        answer: "앱은 픽셀 대신 'Facebook SDK'를 설치해야 합니다. 작동 원리는 비슷하지만 구현 방식은 다릅니다."
      }
    ],
    tasks: [
      {
        id: 't1',
        description: "'Contact' 이벤트를 추적하여 시작하기",
        validate: (events) => {
           const hasEvent = events.some(e => e.type === 'Meta' && e.command === 'track' && e.args[0] === 'Contact');
           return { passed: hasEvent, message: hasEvent ? "픽셀 작동 확인!" : "코드를 실행해주세요." };
        }
      }
    ],
    hint: "fbq('track', 'Contact');",
    solutionCode: `fbq('track', 'Contact');`
  },

  {
    id: 'meta-l1',
    track: 'Meta',
    title: '1. 메타 픽셀 기초 (fbq)',
    description: `
# 페이스북(Meta) 광고의 핵심, 픽셀

메타 픽셀은 \`fbq\`(Facebook Query)라는 함수를 사용합니다.
구조는 GA4와 매우 유사합니다. 먼저 픽셀 ID로 초기화(init)하고, 그 다음에 추적(track)합니다.

### 핵심 문법
\`\`\`javascript
// 1. 초기화
fbq('init', 'PIXEL_ID');

// 2. 페이지 조회 추적 (기본)
fbq('track', 'PageView');
\`\`\`

메타 픽셀은 페이지가 로드될 때마다 기본적으로 \`PageView\` 이벤트를 발생시켜야, 광고 관리자에서 "아, 사람이 들어왔구나"라고 인식합니다.

---

### 🎯 실습 목표
1.  픽셀 ID \`123456789\`로 초기화하세요.
2.  초기화 직후, \`PageView\` 이벤트를 추적하세요.
    `,
    initialCode: `// 1. 픽셀 초기화 (init)

// 2. 페이지 뷰 추적 (track PageView)
`,
    faqs: [
      {
        question: "SPA(React 등)에서는 PageView를 어떻게 하나요?",
        answer: "페이지가 바뀔 때마다(URL 변경 시점) 개발자가 수동으로 `fbq('track', 'PageView')`를 다시 호출해줘야 합니다. 그렇지 않으면 첫 진입 페이지만 기록됩니다."
      },
      {
        question: "여러 개의 픽셀 ID를 심어도 되나요?",
        answer: "네, 대행사를 쓰거나 여러 부서에서 관리할 때 `fbq('init', 'ID_1'); fbq('init', 'ID_2');` 처럼 여러 번 초기화하면 이후 `track` 명령이 모든 ID로 전송됩니다."
      }
    ],
    tasks: [
      {
        id: 't1',
        description: "픽셀 ID '123456789'로 초기화하세요.",
        validate: (events) => {
           const init = events.some(e => e.type === 'Meta' && e.command === 'init' && e.args[0] === '123456789');
           return { passed: init, message: init ? "초기화 성공." : "fbq('init', ...)이 호출되지 않았습니다." };
        }
      },
      {
        id: 't2',
        description: "'PageView' 이벤트를 추적하세요.",
        validate: (events) => {
           const pv = events.some(e => e.type === 'Meta' && e.command === 'track' && e.args[0] === 'PageView');
           return { passed: pv, message: pv ? "페이지뷰 추적됨." : "PageView 이벤트가 없습니다." };
        }
      }
    ],
    hint: "fbq('init', '123456789');\nfbq('track', 'PageView');",
    solutionCode: `fbq('init', '123456789');
fbq('track', 'PageView');`
  },
  {
    id: 'meta-l2',
    track: 'Meta',
    title: '2. 표준 이벤트와 파라미터',
    description: `
# 메타 표준 이벤트 (Standard Events)

메타는 광고 성과 최적화를 위해 미리 정의된 **표준 이벤트**들을 가지고 있습니다.
예: \`ViewContent\`(상품조회), \`AddToCart\`(장바구니), \`Purchase\`(구매).

이 이벤트들은 대소문자를 정확히 지켜야 합니다. (\`addtocart\` (X) -> \`AddToCart\` (O))

### 문법
\`\`\`javascript
fbq('track', '이벤트명', {
  content_name: '상품명',
  value: 1000,
  currency: 'KRW'
});
\`\`\`

---

### 🎯 실습 목표
사용자가 "파란색 셔츠" 상품 상세페이지를 보고 있습니다.

1.  \`ViewContent\` 이벤트를 사용하세요. (상품 조회)
2.  상품명(\`content_name\`)은 'Blue Shirt'입니다.
3.  \`content_type\` 파라미터에 'product'를 추가하세요. (메타 필수 권장사항)
    `,
    initialCode: `fbq('init', '123456789');
fbq('track', 'PageView');

// 아래에 상품 조회(ViewContent) 이벤트를 추가하세요.
`,
    faqs: [
      {
        question: "content_type: 'product'는 왜 넣나요?",
        answer: "이게 있어야 메타의 '다이내믹 애드(DPA)' 카탈로그와 연동됩니다. 여행 상품이라면 'hotel', 'flight' 등을 씁니다."
      },
      {
        question: "content_ids는 무엇인가요?",
        answer: "가장 중요한 파라미터입니다. 사용자가 본 상품 ID를 배열 `['sku_123']`로 보내주면, 메타가 해당 상품을 피드에서 찾아내어 나중에 페이스북 피드에서 다시 보여줍니다(리타겟팅)."
      }
    ],
    tasks: [
      {
        id: 't1',
        description: "'ViewContent' 이벤트를 추적하세요.",
        validate: (events) => {
           const evt = events.find(e => e.type === 'Meta' && e.command === 'track' && e.args[0] === 'ViewContent');
           return { passed: !!evt, message: "ViewContent 이벤트 확인됨." };
        }
      },
      {
        id: 't2',
        description: "content_name: 'Blue Shirt'를 포함하세요.",
        validate: (events) => {
           const evt = events.find(e => e.type === 'Meta' && e.command === 'track' && e.args[0] === 'ViewContent');
           return { passed: evt?.args[1]?.content_name === 'Blue Shirt', message: "상품명 확인됨." };
        }
      },
      {
        id: 't3',
        description: "content_type: 'product'를 포함하세요.",
        validate: (events) => {
           const evt = events.find(e => e.type === 'Meta' && e.command === 'track' && e.args[0] === 'ViewContent');
           return { passed: evt?.args[1]?.content_type === 'product', message: "content_type 확인됨." };
        }
      }
    ],
    hint: "fbq('track', 'ViewContent', { content_name: '...', ... });",
    solutionCode: `fbq('init', '123456789');
fbq('track', 'PageView');

fbq('track', 'ViewContent', {
  content_name: 'Blue Shirt',
  content_type: 'product'
});`
  }
];