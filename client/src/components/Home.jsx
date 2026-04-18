export default function Home({ onTeacher, onStudent }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-10 relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center relative">
        <div className="text-8xl mb-5 animate-float select-none">🏎️</div>
        <h1 className="font-fun text-6xl sm:text-7xl text-white tracking-wide leading-tight">
          Carrera de{' '}
          <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Mecanografía
          </span>
        </h1>
        <p className="mt-4 text-slate-300 text-xl font-semibold">
          ⌨️ &nbsp;¿Quién escribe más rápido? ¡A competir!
        </p>
      </div>

      {/* Mode buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <button
          onClick={onTeacher}
          className="flex-1 group relative overflow-hidden flex flex-col items-center gap-4 bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 rounded-3xl p-9 shadow-2xl shadow-purple-900/50 border border-purple-400/30 transition-all duration-200 hover:scale-105 hover:shadow-glow-purple"
        >
          <span className="text-6xl group-hover:animate-wiggle transition-all">👨‍🏫</span>
          <span className="font-fun text-2xl text-white">Soy Docente</span>
          <span className="text-purple-200 text-sm text-center leading-snug">
            Crear sala y gestionar la carrera
          </span>
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        </button>

        <button
          onClick={onStudent}
          className="flex-1 group relative overflow-hidden flex flex-col items-center gap-4 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-3xl p-9 shadow-2xl shadow-emerald-900/50 border border-emerald-400/30 transition-all duration-200 hover:scale-105 hover:shadow-glow-green"
        >
          <span className="text-6xl group-hover:animate-wiggle transition-all">🎮</span>
          <span className="font-fun text-2xl text-white">Soy Estudiante</span>
          <span className="text-emerald-100 text-sm text-center leading-snug">
            Unirme a una sala y competir
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        </button>
      </div>

      <p className="text-slate-500 text-sm">
        🌟 Mejora tu velocidad de escritura compitiendo con tus compañeros
      </p>
    </div>
  )
}
