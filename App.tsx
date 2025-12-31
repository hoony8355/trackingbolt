import React, { useState } from 'react';
import { ALL_LESSONS, TRACKS } from './data/lessonRegistry';
import LessonView from './components/LessonView';
import LandingPage from './components/LandingPage';
import { Lesson } from './types';

const App: React.FC = () => {
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState<string>(ALL_LESSONS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Sidebar Toggle State (Keys: 'GA4', 'GTM', 'Meta')
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({
    GA4: true,
    GTM: false,
    Meta: false,
  });

  const activeLesson = ALL_LESSONS.find(l => l.id === activeLessonId) || ALL_LESSONS[0];

  const handleLessonComplete = () => {
    const currentIndex = ALL_LESSONS.findIndex(l => l.id === activeLessonId);
    if (currentIndex < ALL_LESSONS.length - 1) {
      const nextLesson = ALL_LESSONS[currentIndex + 1];
      setActiveLessonId(nextLesson.id);
      
      // Ensure the track of the next lesson is expanded
      setExpandedTracks(prev => ({
        ...prev,
        [nextLesson.track]: true
      }));
    } else {
      alert("축하합니다! 준비된 모든 레슨을 완료했습니다.");
      setIsLandingPage(true);
    }
  };

  const toggleTrack = (trackKey: string) => {
    setExpandedTracks(prev => ({
      ...prev,
      [trackKey]: !prev[trackKey]
    }));
  };

  const handleStartTrack = (trackKey: string) => {
    // Find the first lesson of this track
    const firstLesson = ALL_LESSONS.find(l => l.track === trackKey);
    if (firstLesson) {
      setActiveLessonId(firstLesson.id);
      setIsLandingPage(false);
      
      // Expand only the selected track
      setExpandedTracks({
        GA4: false,
        GTM: false,
        Meta: false,
        [trackKey]: true
      });
      
      if (window.innerWidth < 1024) setSidebarOpen(false);
    }
  };

  const goToHome = () => {
    setIsLandingPage(true);
    if (window.innerWidth < 1024) setSidebarOpen(false);
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
          className="p-2 bg-gray-800 rounded shadow text-white border border-gray-700"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform absolute lg:relative z-40 w-72 h-full bg-gray-900 border-r border-gray-700 flex flex-col shadow-xl`}>
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-700 bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors" onClick={goToHome}>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="bg-yellow-500 text-black px-1.5 rounded text-sm font-mono shadow-lg shadow-yellow-500/20">JS</span>
            TrackingBolt
          </h1>
          <p className="text-xs text-gray-500 mt-1">실전 GA4 & 픽셀 시뮬레이터</p>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          
          {/* Home Button (Visible in Sidebar) */}
          <button 
            onClick={goToHome}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-bold flex items-center gap-2 mb-4 transition-colors ${isLandingPage ? 'bg-blue-900/50 text-blue-200 border border-blue-800' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <span>🏠</span> 홈으로
          </button>

          {/* Track Groups */}
          {Object.keys(groupedLessons).map(trackKey => {
             const isExpanded = expandedTracks[trackKey];
             const lessons = groupedLessons[trackKey];
             const activeInThisTrack = !isLandingPage && activeLesson.track === trackKey;
             
             return (
               <div key={trackKey} className="rounded-lg overflow-hidden border border-transparent">
                 {/* Track Header (Toggle) */}
                 <button
                   onClick={() => toggleTrack(trackKey)}
                   className={`w-full flex items-center justify-between px-3 py-3 text-xs font-extrabold uppercase tracking-widest transition-colors ${
                     activeInThisTrack ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-800/50 hover:text-gray-300'
                   }`}
                 >
                   <span>{TRACKS[trackKey as keyof typeof TRACKS] || trackKey}</span>
                   <span className="text-[10px] opacity-70 transform transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                     ▼
                   </span>
                 </button>

                 {/* Lessons List (Collapsible) */}
                 <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-0.5 bg-gray-900/50 pb-2">
                      {lessons.map((lesson, idx) => {
                        const isActive = !isLandingPage && lesson.id === activeLessonId;
                        const displayTitle = lesson.title.replace(/^레슨 \d+:\s/, '').replace(/^\d+\.\s/, ''); 

                        return (
                          <li key={lesson.id}>
                            <button
                              onClick={() => {
                                setActiveLessonId(lesson.id);
                                setIsLandingPage(false);
                                if (window.innerWidth < 1024) setSidebarOpen(false);
                              }}
                              className={`w-full text-left pl-6 pr-3 py-2 text-sm transition-all border-l-2 ${
                                isActive 
                                  ? 'border-blue-500 text-blue-300 bg-blue-900/20 font-medium' 
                                  : 'border-transparent text-gray-500 hover:text-gray-200 hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-start">
                                <span className="text-[10px] min-w-[20px] pt-0.5 opacity-50">{idx}.</span>
                                <span className="truncate">{displayTitle}</span>
                              </div>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                 </div>
               </div>
             );
          })}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-[10px] text-gray-600 text-center uppercase tracking-wider bg-gray-900">
          &copy; TrackingBolt
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
        {isLandingPage ? (
          <LandingPage onStartTrack={handleStartTrack} />
        ) : (
          <LessonView 
            lesson={activeLesson}
            onComplete={handleLessonComplete}
          />
        )}
      </div>
    </div>
  );
};

export default App;