import React, { useState } from 'react';
import { ALL_LESSONS, TRACKS } from './data/lessonRegistry';
import LessonView from './components/LessonView';
import { Lesson } from './types';

const App: React.FC = () => {
  const [activeLessonId, setActiveLessonId] = useState<string>(ALL_LESSONS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeLesson = ALL_LESSONS.find(l => l.id === activeLessonId) || ALL_LESSONS[0];

  const handleLessonComplete = () => {
    const currentIndex = ALL_LESSONS.findIndex(l => l.id === activeLessonId);
    if (currentIndex < ALL_LESSONS.length - 1) {
      setActiveLessonId(ALL_LESSONS[currentIndex + 1].id);
    } else {
      alert("축하합니다! 준비된 모든 레슨을 완료했습니다.");
    }
  };

  const groupedLessons: Record<string, Lesson[]> = ALL_LESSONS.reduce((acc, lesson) => {
    const track = lesson.track;
    if (!acc[track]) acc[track] = [];
    acc[track].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden font-sans">
      
      {/* Mobile Toggle */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gray-800 rounded shadow text-white"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform absolute lg:relative z-40 w-64 h-full bg-gray-900 border-r border-gray-700 flex flex-col`}>
        <div className="p-5 border-b border-gray-700 bg-gray-900">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="bg-yellow-500 text-black px-1.5 rounded text-sm font-mono shadow-lg shadow-yellow-500/20">JS</span>
            TrackingBolt
          </h1>
          <p className="text-xs text-gray-500 mt-1">실전 GA4 & 픽셀 시뮬레이터</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.keys(groupedLessons).map(trackKey => (
            <div key={trackKey}>
              <h3 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 pl-2">
                {TRACKS[trackKey as keyof typeof TRACKS] || trackKey}
              </h3>
              <ul className="space-y-1">
                {groupedLessons[trackKey].map((lesson, idx) => {
                   const isActive = lesson.id === activeLessonId;
                   // Clean up title for sidebar
                   const displayTitle = lesson.title.replace(/^레슨 \d+:\s/, ''); 

                   return (
                     <li key={lesson.id}>
                       <button
                         onClick={() => {
                           setActiveLessonId(lesson.id);
                           if (window.innerWidth < 1024) setSidebarOpen(false);
                         }}
                         className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-all ${
                           isActive 
                             ? 'bg-blue-600/20 text-blue-200 border-l-[3px] border-blue-500 font-medium' 
                             : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100 border-l-[3px] border-transparent'
                         }`}
                       >
                         <span className="opacity-50 text-xs mr-2">{idx + 1}.</span> {displayTitle}
                       </button>
                     </li>
                   )
                })}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-700 text-[10px] text-gray-600 text-center uppercase tracking-wider">
          &copy; {new Date().getFullYear()} TrackingBolt
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        <LessonView 
          lesson={activeLesson}
          onComplete={handleLessonComplete}
        />
      </div>
    </div>
  );
};

export default App;
