import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Lesson, ValidationResult, TrackingEvent } from '../types';
import CodeEditor from './CodeEditor';
import ResultPanel from './ResultPanel';
import { MockRuntime } from '../services/mockRuntime';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, onComplete }) => {
  const [code, setCode] = useState(lesson.initialCode);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});
  const [runtime] = useState(() => new MockRuntime());
  const [allPassed, setAllPassed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Subscribe to runtime updates
  useEffect(() => {
    const unsubscribe = runtime.subscribe((updatedEvents) => {
      setEvents(updatedEvents);
      
      const results: Record<string, ValidationResult> = {};
      let passedCount = 0;

      lesson.tasks.forEach(task => {
        const res = task.validate(updatedEvents);
        results[task.id] = res;
        if (res.passed) passedCount++;
      });

      setValidationResults(results);
      
      const isComplete = passedCount === lesson.tasks.length;
      if (isComplete && !allPassed) {
        setAllPassed(true);
        setShowSuccessModal(true);
      } else if (!isComplete) {
        setAllPassed(false);
        setShowSuccessModal(false);
      }
    });

    return () => unsubscribe();
  }, [runtime, lesson.tasks, allPassed]);

  // Reset state when lesson changes
  useEffect(() => {
    setCode(lesson.initialCode);
    setEvents([]);
    setError(null);
    setValidationResults({});
    setAllPassed(false);
    setShowSuccessModal(false);
    runtime.clear();
  }, [lesson.id, lesson.initialCode, runtime]);

  const handleRun = useCallback(() => {
    const result = runtime.execute(code, lesson.setupScript);
    if (!result.success) {
      setError(result.error || '알 수 없는 오류');
      return;
    }
    setError(null);
  }, [code, lesson.setupScript, runtime]);

  const handleShowSolution = () => {
    if (lesson.solutionCode) {
      if (window.confirm("정말 보시겠습니까? 먼저 직접 풀어보세요!")) {
        setCode(lesson.solutionCode);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* LEFT: Instructions (40%) */}
      <div className="lg:w-5/12 flex flex-col h-full border-r border-gray-700 bg-gray-50">
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar prose prose-sm max-w-none prose-slate">
           <div className="mb-6">
             <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold mb-3 tracking-wide ${
               lesson.track === 'GA4' ? 'bg-orange-100 text-orange-800' :
               lesson.track === 'GTM' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'
             }`}>
               {lesson.track}
             </span>
             <h1 className="text-3xl font-extrabold text-gray-900 m-0 leading-tight">{lesson.title}</h1>
           </div>

          <div className="text-gray-700 leading-relaxed">
            <ReactMarkdown 
              components={{
                code({node, inline, className, children, ...props}: any) {
                  return !inline ? (
                     <div className="bg-gray-800 text-gray-200 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm leading-relaxed border border-gray-700 shadow-sm">
                       {children}
                     </div>
                  ) : (
                    <code className="bg-white text-pink-600 px-1.5 py-0.5 rounded border border-gray-200 text-sm font-mono font-bold shadow-sm" {...props}>
                      {children}
                    </code>
                  )
                },
                h3({children}: any) {
                  return <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3 pb-2 border-b border-gray-200">{children}</h3>
                }
              }}
            >
              {lesson.description}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* RIGHT: Editor & DevTools (60%) */}
      <div className="lg:w-7/12 flex flex-col h-full bg-[#1e1e1e] relative">
        
        {/* Top: Code Editor (60% height) */}
        <div className="flex-grow h-[60%] flex flex-col border-b border-gray-700 relative z-10">
          <CodeEditor 
            preCode={lesson.preCode}
            code={code} 
            postCode={lesson.postCode}
            onChange={setCode} 
          />
          
          {/* Action Bar */}
          <div className="bg-[#252526] px-5 py-3 border-t border-gray-700 flex justify-between items-center shadow-lg">
            <button 
              onClick={handleShowSolution}
              className="text-gray-400 text-xs font-medium hover:text-white hover:underline disabled:opacity-30 transition-colors"
              disabled={!lesson.solutionCode}
            >
              💡 정답 코드 보기
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => {
                    setCode(lesson.initialCode);
                    runtime.clear();
                    setError(null);
                }}
                className="px-4 py-2 bg-[#333] border border-gray-600 text-gray-300 rounded hover:bg-[#444] text-xs font-bold transition-colors"
              >
                ↺ 초기화
              </button>
              {allPassed ? (
                 <button
                 onClick={onComplete}
                 className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 text-xs font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 animate-pulse"
               >
                 <span>다음 레슨으로 이동</span>
                 <span>→</span>
               </button>
              ) : (
                <button
                  onClick={handleRun}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-95 border border-blue-500 hover:border-blue-400"
                >
                  <span>▶ 코드 실행 & 검증</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: ResultPanel (DevTools) (40% height) */}
        <div className="h-[40%] bg-white flex flex-col min-h-0 relative z-0">
          <ResultPanel 
            events={events} 
            tasks={lesson.tasks}
            validationResults={validationResults}
            error={error}
          />
        </div>

        {/* Success Modal Overlay */}
        {showSuccessModal && (
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-white z-50 animate-fade-in p-8 text-center">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 max-w-sm w-full">
              <div className="text-5xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-2xl font-bold mb-2 text-white">미션 성공!</h2>
              <p className="text-gray-400 mb-6 text-sm">
                모든 테스트를 통과했습니다.<br/>
                결과 패널을 확인하거나 다음으로 넘어가세요.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={onComplete}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg"
                >
                  다음 레슨으로 이동 →
                </button>
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-2 bg-transparent hover:bg-gray-700 text-gray-400 hover:text-white text-sm font-medium rounded-lg border border-gray-600 transition-all"
                >
                  결과 분석하기 (닫기)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonView;