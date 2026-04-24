"use client";

export function HomeFooter() {
  return (
    <footer className="w-full max-w-[1440px] px-8 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6 z-20">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
        © 2026 Syamna Quran
      </div>
      <div className="flex gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
        <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
        <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
        <span className="hover:text-primary cursor-pointer transition-colors">About</span>
      </div>
    </footer>
  );
}
