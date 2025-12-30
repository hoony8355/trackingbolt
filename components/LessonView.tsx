import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Lesson, ValidationResult, TrackingEvent } from '../types';
import CodeEditor from './CodeEditor';
import ResultPanel from './ResultPanel';
import MockBrowser from './MockBrowser';
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
    <div className="flex flex-col lg:flex-row h-full">
      {/* LEFT: Instructions & Editor (50%) */}
      <div className="lg:w-1/2 flex flex-col h-full border-r border-gray-300">
        
        {/* Instruction Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-white prose prose-sm max-w-none prose-slate">
           <div className="mb-4">
             <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-2 ${
               lesson.track === 'GA4' ? 'bg-orange-100 text-orange-800' :
               lesson.track === 'GTM' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'
             }`}>
               {lesson.track}
             </span>
             <h1 className="text-2xl font-bold text-gray-900 m-0">{lesson.title}</h1>
           </div>

          <div className="text-gray-700">
            <ReactMarkdown 
              components={{
                code({node, inline, className, children, ...props}: any) {
                  return !inline ? (
                     <div className="bg-gray-800 text-gray-100 p-3 rounded-md my-3 overflow-x-auto font-mono text-sm leading-relaxed border border-gray-700 shadow-sm">
                       {children}
                     </div>
                  ) : (
                    <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono font-bold" {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {lesson.description}
            </ReactMarkdown>
          </div>
        </div>

        {/* Editor Area */}
        <div className="h-[400px] flex flex-col border-t border-gray-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 bg-[#1e1e1e]">
          <CodeEditor 
            preCode={lesson.preCode}
            code={code} 
            postCode={lesson.postCode}
            onChange={setCode} 
          />
          
          <div className="bg-[#252526] px-4 py-3 border-t border-gray-700 flex justify-between items-center">
            <button 
              onClick={handleShowSolution}
              className="text-gray-500 text-xs font-medium hover:text-gray-300 hover:underline disabled:opacity-30"
              disabled={!lesson.solutionCode}
            >
              정답 코드 보기
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
                초기화
              </button>
              {allPassed ? (
                 <button
                 onClick={onComplete}
                 className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-500 text-xs font-bold flex items-center gap-1.5 shadow-sm animate-pulse"
               >
                 <span>다음 레슨으로 이동 →</span>
               </button>
              ) : (
                <button
                  onClick={handleRun}
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 border border-blue-500"
                >
                  <span>▶ 코드 실행 & 저장</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Mock Browser & Results (50%) */}
      <div className="lg:w-1/2 h-full bg-gray-100 flex flex-col relative border-l border-gray-300">
        
        {/* Top: Mock Browser View */}
        <div className="h-[45%] p-4 bg-gray-200 border-b border-gray-300">
           <div className="h-full flex flex-col">
              <div className="flex justify-between items-end mb-2 px-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preview Environment</span>
                <span className="text-[10px] text-gray-400">Mock Browser Context</span>
              </div>
              <MockBrowser />
           </div>
        </div>

        {/* Bottom: DevTools/Console */}
        <div className="flex-1 min-h-0 bg-white relative">
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
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
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
