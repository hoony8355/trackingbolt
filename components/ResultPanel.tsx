import React, { useState } from 'react';
import { TrackingEvent, Task, ValidationResult } from '../types';

interface ResultPanelProps {
  events: TrackingEvent[];
  tasks: Task[];
  validationResults: Record<string, ValidationResult>;
  error: string | null;
}

type Tab = 'debug' | 'stream' | 'payload';

const ResultPanel: React.FC<ResultPanelProps> = ({ events, tasks, validationResults, error }) => {
  const [activeTab, setActiveTab] = useState<Tab>('debug');

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-300">
      {/* Header/Tabs */}
      <div className="flex items-center bg-gray-50 border-b border-gray-200 px-2">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-4 px-2">DevTools</div>
        <button
          onClick={() => setActiveTab('debug')}
          className={`px-3 py-2 text-xs font-bold transition-colors ${activeTab === 'debug' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Mission
        </button>
        <button
          onClick={() => setActiveTab('stream')}
          className={`px-3 py-2 text-xs font-bold transition-colors ${activeTab === 'stream' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Stream <span className="ml-1 bg-gray-200 text-gray-600 px-1.5 rounded-full text-[10px]">{events.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('payload')}
          className={`px-3 py-2 text-xs font-bold transition-colors ${activeTab === 'payload' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Payload
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-white p-0 relative">
        
        {/* Runtime Error Display */}
        {error && (
          <div className="m-2 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-mono">
            <strong>🚫 Uncaught Error:</strong> {error}
          </div>
        )}

        {/* TAB: MISSION CHECKLIST (DEBUG) */}
        {activeTab === 'debug' && (
          <div className="p-4 space-y-4">
             <div>
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-1">
                  <span>🎯 미션 체크리스트</span>
                </h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  우측 에디터에 코드를 작성하고 [실행] 하세요.<br/>
                  아래 항목이 모두 <span className="text-green-600 font-bold">초록색(✔)</span>이 되어야 통과입니다.
                </p>
                
                <div className="space-y-2">
                  {tasks.map((task) => {
                    const result = validationResults[task.id];
                    const isPassed = result?.passed;

                    return (
                      <div 
                        key={task.id} 
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          isPassed 
                            ? 'bg-green-50 border-green-200 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                             isPassed 
                             ? 'bg-green-100 text-green-700 border-green-300' 
                             : 'bg-gray-100 text-gray-400 border-gray-300'
                          }`}>
                            {isPassed ? '✔' : '?'}
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs font-semibold ${isPassed ? 'text-gray-800' : 'text-gray-700'}`}>
                              {task.description}
                            </p>
                            <div className={`text-[11px] mt-1.5 font-mono ${isPassed ? 'text-green-600' : 'text-orange-500'}`}>
                              {result?.message ? (
                                <span className="flex items-center gap-1">
                                  {isPassed ? '' : '⚠️'} {result.message}
                                </span>
                              ) : (
                                <span className="text-gray-300">결과 대기 중...</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
            
            {events.length === 0 && !error && (
              <div className="p-4 bg-blue-50 text-blue-800 rounded text-xs text-center border border-blue-100 mt-8">
                <strong>💡 Tip:</strong> 코드를 수정하고 <code>▶ 코드 실행</code> 버튼을 눌러보세요.
              </div>
            )}
          </div>
        )}

        {/* TAB: EVENT STREAM */}
        {activeTab === 'stream' && (
          <div className="flex flex-col h-full">
            {events.length === 0 ? (
              <p className="text-gray-400 text-xs text-center mt-6">이벤트 전송 내역이 없습니다.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold sticky top-0 z-10 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 w-10">#</th>
                    <th className="px-3 py-2 w-20">Type</th>
                    <th className="px-3 py-2 w-24">Command</th>
                    <th className="px-3 py-2">Details</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {events.map((evt, idx) => (
                    <tr key={evt.id} className="border-b border-gray-100 hover:bg-blue-50">
                      <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          evt.type === 'GA4' ? 'bg-orange-100 text-orange-700' :
                          evt.type === 'GTM' ? 'bg-blue-100 text-blue-700' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {evt.type}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-semibold text-gray-700">{evt.command}</td>
                      <td className="px-3 py-2 text-gray-500 truncate max-w-[150px]">
                         {evt.args.length > 0 ? JSON.stringify(evt.args[0]) : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB: PAYLOAD INSPECTOR */}
        {activeTab === 'payload' && (
          <div className="p-0 h-full bg-gray-50">
             {events.length === 0 ? (
              <p className="text-gray-400 text-xs text-center mt-6">데이터가 없습니다.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {events.map((evt) => (
                  <div key={evt.id} className="bg-white">
                    <div className="px-3 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-500 flex justify-between items-center">
                      <span>{evt.type} &gt; {evt.command}</span>
                      <span className="font-mono font-normal opacity-50">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <pre className="p-3 text-[11px] overflow-x-auto text-gray-800 font-mono leading-relaxed bg-white">
                      {JSON.stringify(evt.args, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPanel;