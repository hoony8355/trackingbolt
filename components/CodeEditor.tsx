import React from 'react';

interface CodeEditorProps {
  preCode?: string;
  code: string;
  postCode?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ preCode, code, postCode, onChange, disabled }) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // Insert 2 spaces for tab
      const newValue = code.substring(0, start) + "  " + code.substring(end);
      
      onChange(newValue);
      
      // Restore cursor position after state update
      // Using requestAnimationFrame to ensure it runs after the render cycle updates the value
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col font-mono text-sm border border-gray-700 rounded-md overflow-hidden bg-[#1e1e1e] shadow-inner">
      <div className="bg-[#252526] px-4 py-1.5 text-xs text-gray-400 font-bold border-b border-gray-700 flex justify-between items-center">
        <span>index.html</span>
        <span className="text-[10px] bg-blue-900 text-blue-200 px-1.5 rounded">JS/HTML</span>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        {/* Read-only Pre Code */}
        {preCode && (
          <div className="px-4 pt-4 pb-1 text-gray-500 select-none bg-[#1e1e1e] whitespace-pre-wrap font-mono leading-relaxed border-l-4 border-transparent opacity-70">
            {preCode}
          </div>
        )}

        {/* Editable Area */}
        <div className="relative group">
           {/* Active Line Indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-50"></div>
          
          <textarea
            className="w-full px-4 py-1 resize-none focus:outline-none bg-[#2d2d2d] text-blue-100 font-mono leading-relaxed block border-y border-gray-700/50"
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            rows={code.split('\n').length + 1} // Auto-grow somewhat
            style={{ minHeight: '60px' }}
          />
        </div>

        {/* Read-only Post Code */}
        {postCode && (
          <div className="px-4 pt-1 pb-4 text-gray-500 select-none bg-[#1e1e1e] whitespace-pre-wrap font-mono leading-relaxed border-l-4 border-transparent opacity-70">
            {postCode}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;