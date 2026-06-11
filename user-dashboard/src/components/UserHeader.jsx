import React from "react";

export default function UserHeader() {
  return (
    <header className="flex items-center justify-between p-6 bg-[#0A1C5C] border-b border-blue-950 sticky top-0 z-50 font-sans shadow-2xl">
      <div className="flex items-center gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 md:gap-5 flex-1">
          <div className="w-10 h-auto md:w-14 md:h-14  flex items-center justify-center ">
            <img
              src="/images/uco-logo.png"
              alt="AdZU UCO Logo"
              className="w-7 md:w-30 h-auto object-contain drop-shadow-md"
            />
          </div>
          <div>
            <h1 className="text-sm md:text-xl font-black text-white tracking-tight leading-tight">
              University Communications Office
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
              <p className="text-[9px] md:text-[10px] font-black text-blue-300/60 tracking-[0.2em] uppercase">
                User Portal
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            <button className="px-4 py-2 text-[10px] font-black text-blue-200 uppercase tracking-widest hover:text-white transition-colors">
              Guidelines
            </button>
            <button className="px-4 py-2 text-[10px] font-black text-blue-200 uppercase tracking-widest hover:text-white transition-colors">
              Support
            </button>
          </nav>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-white uppercase ">
                Active Session
              </p>
              <p className="text-[9px] font-bold text-blue-400">
                co230532@adzu.edu.ph
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xs font-black shadow-lg border border-indigo-400/30">
              JS
            </div>
          </div>
        </div>

        {/* Mobile Mini Profile */}
        <div className="lg:hidden flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-lg">
            JS
          </div>
        </div>
      </div>
    </header>
  );
}
