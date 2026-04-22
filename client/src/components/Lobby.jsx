import { CHARACTERS } from '../constants'

export default function Lobby({ role, roomCode, roomText, room, onStart, onBack }) {
  const players  = room?.players ?? []
  const canStart = players.length >= 1

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-violet-300/20 dark:bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-pink-300/20 dark:bg-pink-600/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-3xl relative">

        {/* Room Code Banner */}
        <div className="room-code-banner rounded-3xl p-7 mb-6 text-center border relative overflow-hidden">
          <p className="room-code-label text-xs font-bold uppercase tracking-[0.3em] mb-3">
            🏠 Código de Sala
          </p>
          <p className="room-code-text font-mono font-black tracking-[0.4em] select-all leading-none"
            style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}>
            {roomCode}
          </p>
          <p className="room-code-label text-sm mt-3 opacity-80">
            Comparte este código con los guests
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Text preview — only visible to teacher */}
          {role === 'host' ? (
            <div className="card-glass p-6">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>📄</span> Texto de la carrera
              </h3>
              <p className="text-slate-700 dark:text-slate-200 font-mono text-sm leading-relaxed line-clamp-6">
                {roomText}
              </p>
              <p className="text-slate-400 text-xs mt-3">{roomText.length} caracteres</p>
            </div>
          ) : (
            <div className="card-glass p-6 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-3">🔒</div>
              <p className="text-slate-500 dark:text-slate-400 font-semibold">Texto oculto</p>
              <p className="text-slate-400 text-xs mt-1">Se revelará cuando empiece la carrera</p>
            </div>
          )}

          {/* Players list */}
          <div className="card-glass p-6">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span>👥</span> Participantes ({players.length})
            </h3>
            {players.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3 animate-bounce">⏳</div>
                <p className="text-slate-400 text-sm">Esperando guests...</p>
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
                        background:  `${char?.color ?? '#7c3aed'}10`,
                        borderColor: `${char?.color ?? '#7c3aed'}30`,
                      }}
                    >
                      <span className="text-2xl">{char?.emoji ?? '🎮'}</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{p.name}</span>
                      <span className="ml-auto flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Listo</span>
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
            className="px-6 py-3 rounded-2xl bg-white/70 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white font-semibold transition-all shadow-sm"
          >
            Salir
          </button>

          {role === 'host' && (
            <button
              onClick={onStart}
              disabled={!canStart}
              className="flex-1 py-4 rounded-2xl font-fun text-xl transition-all"
              style={canStart ? {
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow:  '0 8px 24px rgba(34,197,94,0.35)',
                color: 'white',
              } : {
                background: 'rgba(0,0,0,0.04)',
                color: '#94a3b8',
                cursor: 'not-allowed',
              }}
            >
              {canStart ? '🚦 ¡Iniciar Carrera!' : '⏳ Esperando participantes...'}
            </button>
          )}

          {role === 'guest' && (
            <div className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 font-bold text-xl text-center">
              ⏳ Esperando que el host inicie...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
