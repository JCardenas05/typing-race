import { CHARACTERS } from '../constants'

export default function Lobby({ role, roomCode, roomText, room, onStart, onBack }) {
  const players = room?.players ?? []
  const canStart = players.length >= 1

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-3xl relative">

        {/* Room Code Banner */}
        <div className="relative overflow-hidden rounded-3xl p-7 mb-6 text-center border"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.15) 100%)',
            borderColor: 'rgba(167,139,250,0.4)',
            boxShadow: '0 0 40px rgba(139,92,246,0.2)',
          }}
        >
          <p className="text-purple-300 text-xs font-bold uppercase tracking-[0.3em] mb-3">
            🏠 Código de Sala
          </p>
          <p
            className="font-mono font-black text-white tracking-[0.4em] select-all leading-none"
            style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}
          >
            {roomCode}
          </p>
          <p className="text-purple-300/80 text-sm mt-3">
            Comparte este código con tus estudiantes
          </p>
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Text preview */}
          <div className="card-glass p-6">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span>📄</span> Texto de la carrera
            </h3>
            <p className="text-slate-200 font-mono text-sm leading-relaxed line-clamp-6">
              {roomText}
            </p>
            <p className="text-slate-500 text-xs mt-3">{roomText.length} caracteres</p>
          </div>

          {/* Players list */}
          <div className="card-glass p-6">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span>👥</span> Participantes ({players.length})
            </h3>

            {players.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3 animate-bounce">⏳</div>
                <p className="text-slate-500 text-sm">Esperando estudiantes...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {players.map(p => {
                  const char = CHARACTERS.find(c => c.id === p.character)
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-xl px-4 py-2.5 border"
                      style={{
                        background: `${char?.color ?? '#7c3aed'}12`,
                        borderColor: `${char?.color ?? '#7c3aed'}35`,
                      }}
                    >
                      <span className="text-2xl">{char?.emoji ?? '🎮'}</span>
                      <span className="font-semibold text-white">{p.name}</span>
                      <span className="ml-auto flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs text-emerald-400 font-semibold">Listo</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
          >
            Salir
          </button>

          {role === 'teacher' && (
            <button
              onClick={onStart}
              disabled={!canStart}
              className="flex-1 py-4 rounded-2xl font-fun text-xl transition-all"
              style={canStart ? {
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 0 30px rgba(34,197,94,0.4)',
                color: 'white',
              } : {
                background: 'rgba(255,255,255,0.05)',
                color: '#64748b',
                cursor: 'not-allowed',
              }}
            >
              {canStart ? '🚦 ¡Iniciar Carrera!' : '⏳ Esperando participantes...'}
            </button>
          )}

          {role === 'student' && (
            <div className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-bold text-xl text-center">
              ⏳ Esperando que el docente inicie...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
