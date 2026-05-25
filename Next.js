import { useState } from 'react';

export default function Header() {
  // Simple state for the theme toggle UI
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="flex justify-between items-center px-2.5 py-3 bg-white rounded-xl shadow-sm font-sans max-w-[600px] mx-auto mt-5 border border-gray-100">
      
      {/* Left Side */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg border border-gray-200 flex justify-center items-center text-lg shadow-sm shrink-0">
          🔍
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-indigo-600 text-[15px] leading-tight font-bold">慳真D</div>
          <div className="text-[9px] text-gray-400 mt-1 whitespace-nowrap">
            更新於: 2026-05-25 08:27
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2.5">
        
        {/* Language Selector */}
        <div className="flex items-center gap-1">
          <span className="hidden min-[390px]:inline text-[10px] text-gray-500 font-bold">
            Eng
          </span>
          <select className="px-1 py-0.5 rounded-md border border-gray-200 bg-gray-50 text-xs text-gray-700 outline-none">
            <option>繁體</option>
          </select>
        </div>

        {/* Action Icons including Theme Switch */}
        <div className="flex items-center gap-1 min-[390px]:gap-1.5">
          {/* Theme Toggle Button */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-7 h-7 rounded-full bg-slate-100 flex justify-center items-center text-[13px] cursor-pointer shrink-0 hover:bg-slate-200 transition-colors border-none outline-none"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          <div className="w-7 h-7 rounded-full bg-amber-50 flex justify-center items-center text-[13px] cursor-pointer shrink-0">
            🔔
          </div>
          <div className="w-7 h-7 rounded-full bg-amber-100 flex justify-center items-center text-[13px] cursor-pointer shrink-0">
            📖
          </div>
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex justify-center items-center text-[13px] cursor-pointer shrink-0">
            🔗
          </div>
        </div>
      </div>
      
    </div>
  );
}