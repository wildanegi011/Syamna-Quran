"use client";

export function HomeFooter() {
  return (
    <footer className="w-full max-w-7xl px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-20 opacity-20">
      <div className="text-[10px] font-black uppercase tracking-widest text-white">
        © 2026 Syamna Quran
      </div>
      <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
        <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
        <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
        <span className="hover:text-primary cursor-pointer transition-colors">About</span>
        <span className="hover:text-primary cursor-pointer transition-colors">Contact</span>
      </div>
    </footer>
  );
}
