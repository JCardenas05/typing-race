export default function Home({ onHost, onGuest }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-10 relative overflow-hidden">
      <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full bg-purple-300/40 dark:bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full bg-cyan-300/30 dark:bg-cyan-500/15 blur-3xl pointer-events-none" />

      <div className="text-center relative">
        <div className="text-8xl mb-5 animate-float select-none">🏎️</div>
        <h1 className="font-fun text-6xl sm:text-7xl text-slate-800 dark:text-white tracking-wide leading-tight">
          Carrera de{' '}
          <span className="bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 dark:from-yellow-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Mecanografía
          </span>
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-300 text-xl font-semibold">
          ⌨️ &nbsp;¿Quién escribe más rápido? ¡A competir!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <button
          onClick={onHost}
          className="flex-1 group relative overflow-hidden flex flex-col items-center gap-4 bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-3xl p-9 shadow-2xl shadow-violet-300/50 dark:shadow-violet-900/50 border border-violet-400/30 transition-all duration-200 hover:scale-105 hover:shadow-glow-purple"
        >
          <span className="text-6xl group-hover:animate-wiggle">👨‍🏫</span>
          <span className="font-fun text-2xl text-white">Host</span>
          <span className="text-violet-100 text-sm text-center leading-snug">Crear sala y gestionar la carrera</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        </button>

        <button
          onClick={onGuest}
          className="flex-1 group relative overflow-hidden flex flex-col items-center gap-4 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-3xl p-9 shadow-2xl shadow-emerald-300/50 dark:shadow-emerald-900/50 border border-emerald-400/30 transition-all duration-200 hover:scale-105 hover:shadow-glow-green"
        >
          <span className="text-6xl group-hover:animate-wiggle">🎮</span>
          <span className="font-fun text-2xl text-white">Guest</span>
          <span className="text-emerald-50 text-sm text-center leading-snug">Unirme a una sala y competir</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        </button>
      </div>

      <p className="text-slate-400 text-sm">
        🌟 Mejora tu velocidad de escritura compitiendo con tus compañeros
      </p>
    </div>
  )
}
