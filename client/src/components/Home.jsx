export default function Home({ onTeacher, onStudent }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-10">
      {/* Header */}
      <div className="text-center">
        <div className="text-7xl mb-4 select-none">🏁</div>
        <h1 className="text-5xl font-black text-white tracking-tight">
          Carrera de <span className="text-sky-400">Mecanografía</span>
        </h1>
        <p className="mt-3 text-slate-400 text-lg font-medium">
          ¿Quién escribe más rápido? ¡A competir!
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <button
          onClick={onTeacher}
          className="flex-1 group flex flex-col items-center gap-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-colors rounded-2xl p-8 shadow-lg shadow-indigo-900/40"
        >
          <span className="text-5xl">👨‍🏫</span>
          <span className="text-xl font-bold text-white">Soy Docente</span>
          <span className="text-indigo-200 text-sm text-center leading-snug">Crear sala y gestionar la carrera</span>
        </button>

        <button
          onClick={onStudent}
          className="flex-1 group flex flex-col items-center gap-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-colors rounded-2xl p-8 shadow-lg shadow-emerald-900/40"
        >
          <span className="text-5xl">🎮</span>
          <span className="text-xl font-bold text-white">Soy Estudiante</span>
          <span className="text-emerald-200 text-sm text-center leading-snug">Unirme a una sala y competir</span>
        </button>
      </div>

      <p className="text-slate-600 text-sm">
        ⌨️ &nbsp; Mejora tu velocidad de escritura compitiendo con tus compañeros
      </p>
    </div>
  )
}
