import React from 'react';

const MockBrowser: React.FC = () => {
  
  // Helper to trigger events on the mock window
  const triggerEvent = (type: 'cart' | 'signup') => {
    // 1. Check if user defined a custom handler (Phase 2 Lesson)
    if (type === 'cart') {
      // @ts-ignore
      if (typeof window.handleCartClick === 'function') {
        // @ts-ignore
        window.handleCartClick();
      } else {
        console.warn("⚠️ [MockBrowser] 'window.handleCartClick' 함수가 정의되지 않았습니다. 코드를 작성하고 실행해주세요.");
        alert("버튼에 연결된 함수(handleCartClick)가 없습니다.\n코드 에디터에서 함수를 정의하고 [▶ 코드 실행]을 눌러주세요.");
      }
      return;
    } 
    
    if (type === 'signup') {
      // @ts-ignore
      if (typeof window.handleSignupClick === 'function') {
        // @ts-ignore
        window.handleSignupClick();
      } else {
        console.warn("⚠️ [MockBrowser] 'window.handleSignupClick' 함수가 정의되지 않았습니다.");
         // For Lesson 1-5, buttons might not be the focus, so we stay silent or provide a hint depending on context.
         // But consistency is key. Let's alert if clicked explicitly.
         alert("버튼에 연결된 함수(handleSignupClick)가 없습니다.");
      }
      return;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-300 text-gray-900 select-none">
      {/* Browser Chrome (Header) */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-1 text-xs text-gray-500 font-mono flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">🔒</span>
            <span className="truncate">https://www.myshop.com/product/coat</span>
          </div>
          <span className="text-[10px] bg-gray-100 px-1 rounded">MOCK</span>
        </div>
      </div>

      {/* Browser Content (Fake E-commerce Site) */}
      <div className="flex-1 overflow-y-auto p-6 bg-white relative">
        <div className="max-w-md mx-auto">
          {/* Fake Breadcrumbs */}
          <div className="text-xs text-gray-400 mb-4 flex justify-between">
            <span>Home &gt; Clothing &gt; Outerwear</span>
            <button 
              id="btn-signup"
              onClick={() => triggerEvent('signup')}
              className="text-blue-500 hover:underline"
            >
              회원가입
            </button>
          </div>
          
          <div className="flex gap-4">
             {/* Fake Image */}
             <div className="w-32 h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs flex-col gap-2">
               <span className="text-2xl">🧥</span>
               <span>IMG</span>
             </div>
             
             {/* Fake Product Info */}
             <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-1">프리미엄 겨울 코트</h2>
                <p className="text-sm text-gray-500 mb-3">따뜻하고 스타일리시한 2024년 신상</p>
                <div className="text-lg font-bold text-blue-600 mb-4">₩59,000</div>
                
                <div className="flex flex-col gap-2">
                  <button 
                    id="btn-cart"
                    onClick={() => triggerEvent('cart')}
                    className="flex-1 bg-black text-white py-2 rounded text-sm font-bold hover:bg-gray-800 transition active:scale-95 shadow-md"
                  >
                    장바구니 담기
                  </button>
                  <button className="flex-1 border border-gray-300 py-2 rounded text-sm font-bold hover:bg-gray-50 text-gray-700">
                    지금 구매하기
                  </button>
                </div>
             </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-2">상품 상세 정보</h3>
            <div className="space-y-2 opacity-50">
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-5/6"></div>
              <div className="h-2 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>

        {/* Interaction Hint Overlay */}
        <div className="absolute bottom-4 right-4 text-xs max-w-[200px] text-right">
          <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-100 shadow-sm inline-block">
             👆 버튼을 클릭하면 내가 만든 코드가 실행됩니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockBrowser;