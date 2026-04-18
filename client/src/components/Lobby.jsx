import { CHARACTERS } from '../constants'

export default function Lobby({ role, roomCode, roomText, room, onStart, onBack }) {
  const players = room?.players ?? []
  const canStart = players.length >= 1

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">

        {/* Room Code Banner */}
        <div className="bg-indigo-900/50 border-2 border-indigo-500 rounded-2xl p-6 mb-6 text-center">
          <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-1">
            Código de Sala
          </p>
          <p className="text-6xl font-black text-white tracking-[0.3em] font-mono select-all">
            {roomCode}
          </p>
          <p className="text-indigo-300 text-sm mt-2">
            Comparte este código con tus estudiantes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Text preview */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Texto de la carrera
            </h3>
            <p className="text-slate-200 font-mono text-sm leading-relaxed line-clamp-6">
              {roomText}
            </p>
            <p className="text-slate-500 text-xs mt-2">{roomText.length} caracteres</p>
          </div>

          {/* Players list */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Participantes ({players.length})
            </h3>

            {players.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2 animate-bounce">⏳</div>
                <p className="text-slate-500 text-sm">Esperando estudiantes...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {players.map(p => {
                  const char = CHARACTERS.find(c => c.id === p.character)
                  return (
                    <div key={p.id} className="flex items-center gap-3 bg-slate-700/50 rounded-xl px-4 py-2.5">
                      <span className="text-2xl">{char?.emoji ?? '🎮'}</span>
                      <span className="font-semibold text-white">{p.name}</span>
                      <span className="ml-auto">
                        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
          >
            Salir
          </button>

          {role === 'teacher' && (
            <button
              onClick={onStart}
              disabled={!canStart}
              className="flex-1 py-4 rounded-xl bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-black text-xl transition-colors shadow-lg shadow-green-900/30"
            >
              {canStart ? '🚦 Iniciar Carrera' : '⏳ Esperando participantes...'}
            </button>
          )}

          {role === 'student' && (
            <div className="flex-1 py-4 rounded-xl bg-slate-700 text-slate-400 font-bold text-xl text-center">
              ⏳ Esperando que el docente inicie...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
