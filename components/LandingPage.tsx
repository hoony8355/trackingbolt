import React from 'react';
import { TRACKS } from '../data/lessonRegistry';
import SEOHead from './SEOHead';

interface LandingPageProps {
  onStartTrack: (track: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartTrack }) => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TrackingBolt",
    "url": "https://www.trackingbolt.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.trackingbolt.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-50 text-gray-800 p-8 overflow-y-auto">
      <SEOHead 
        title="홈"
        description="GA4, GTM, Meta Pixel 실전 코딩 학습 플랫폼. 마케터와 개발자를 위한 인터랙티브 트래킹 가이드."
        url="https://www.trackingbolt.com/"
        schema={websiteSchema}
      />
      
      <div className="max-w-4xl w-full space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-block p-3 rounded-full bg-blue-100 mb-2">
            <span className="text-4xl">⚡</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            TrackingBolt
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            마케터와 개발자를 위한 실전 트래킹 학습 플랫폼.<br/>
            <span className="font-semibold text-blue-600">GA4, GTM, Meta Pixel</span> 코드를 직접 작성하고 검증하세요.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* GA4 Card */}
          <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{TRACKS.GA4}</h3>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              gtag.js를 사용하여 이벤트를 직접 전송하고, 전자상거래 데이터를 구조화하는 방법을 배웁니다.
            </p>
            <button 
              onClick={() => onStartTrack('GA4')}
              className="w-full py-2.5 px-4 bg-orange-50 text-orange-700 font-bold rounded-lg hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              GA4 학습하기 <span>→</span>
            </button>
          </div>

          {/* GTM Card */}
          <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🏷️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{TRACKS.GTM}</h3>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              Data Layer(데이터 레이어)의 원리를 이해하고, GTM 컨테이너로 데이터를 전달하는 핵심 로직을 익힙니다.
            </p>
            <button 
              onClick={() => onStartTrack('GTM')}
              className="w-full py-2.5 px-4 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              GTM 학습하기 <span>→</span>
            </button>
          </div>

          {/* Meta Card */}
          <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              ♾️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{TRACKS.META}</h3>
            <p className="text-sm text-gray-500 mb-6 flex-1">
              페이스북 광고 성과 최적화를 위한 픽셀(Pixel) 설치와 표준 이벤트 파라미터 설정을 실습합니다.
            </p>
            <button 
              onClick={() => onStartTrack('Meta')}
              className="w-full py-2.5 px-4 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              Pixel 학습하기 <span>→</span>
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center pt-8 border-t border-gray-200 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} TrackingBolt. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;