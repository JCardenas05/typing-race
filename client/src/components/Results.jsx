import { useRef } from 'react'
import { CHARACTERS, POSITION_MEDALS } from '../constants'

const CONFETTI_COLORS = ['#facc15','#ec4899','#06b6d4','#10b981','#7c3aed','#f97316','#ef4444','#a855f7']

const RANK_CLASSES = ['rank-card-0','rank-card-1','rank-card-2']
const RANK_NAMES   = ['rank-name-0','rank-name-1','rank-name-2']

export default function Results({ players, role, onPlayAgain }) {
  if (!players) return null

  const confettiPieces = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left:     Math.random() * 100,
      delay:    Math.random() * 4,
      color:    CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size:     6 + Math.random() * 9,
      duration: 3.5 + Math.random() * 3,
      isCircle: i % 3 === 0,
      rotate:   Math.random() * 360,
    }))
  )

  const sorted = [...players].sort((a, b) => {
    if (a.finished && b.finished) return (a.position ?? 99) - (b.position ?? 99)
    if (a.finished) return -1
    if (b.finished) return 1
    return b.progress - a.progress
  })

  const winner     = sorted[0]
  const winnerChar = CHARACTERS.find(c => c.id === winner?.character)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Confetti */}
      {confettiPieces.current.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed', left: `${p.left}%`, top: '-12px',
            width: `${p.size}px`, height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
            zIndex: 0, pointerEvents: 'none',
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}

      <div className="w-full max-w-2xl relative z-10">

        {winner && (
          <div className="text-center mb-8 animate-pop-in">
            <div className="text-8xl mb-4 animate-float">{winnerChar?.emoji ?? '🏆'}</div>
            <h1 className="font-fun text-5xl sm:text-6xl text-slate-800 dark:text-white mb-2">
              🥇 {winner.name}{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                gana!
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              <span className="text-violet-600 dark:text-cyan-400 font-black">{winner.wpm} PPM</span>
              {' · '}
              <span className="text-emerald-600 dark:text-emerald-400 font-black">{Math.round(winner.progress)}%</span> completado
            </p>
          </div>
        )}

        <div className="card-glass p-6 mb-6">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
            <span>🏆</span> Clasificación Final
          </h2>
          <div className="flex flex-col gap-3">
            {sorted.map((p, i) => {
              const char       = CHARACTERS.find(c => c.id === p.character)
              const medal      = POSITION_MEDALS[i] ?? `${i + 1}.`
              const cardClass  = RANK_CLASSES[i] ?? 'rank-card-def'
              const nameClass  = RANK_NAMES[i]   ?? 'rank-name-def'

              return (
                <div
                  key={p.id}
                  className={`${cardClass} flex items-center gap-4 rounded-2xl px-4 py-3 border transition-all`}
                >
                  <span className="text-2xl w-8 text-center">{medal}</span>
                  <span className="text-3xl">{char?.emoji ?? '🎮'}</span>
                  <div className="flex-1">
                    <p className={`${nameClass} font-bold`}>{p.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {p.finished ? '✓ Completó el texto' : `${Math.round(p.progress)}% completado`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-violet-600 dark:text-cyan-400 font-black text-xl tabular-nums">{p.wpm}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">PPM</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-4">
          {role === 'host' ? (
            <button
              onClick={onPlayAgain}
              className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-fun text-2xl rounded-2xl transition-all shadow-lg shadow-violet-200/50 dark:shadow-violet-900/40 hover:shadow-glow-purple hover:scale-[1.02] active:scale-[0.98]"
            >
              🔄 Jugar de nuevo
            </button>
          ) : (
            <button
              onClick={onPlayAgain}
              className="flex-1 py-4 bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-fun text-xl rounded-2xl transition-all shadow-sm"
            >
              🏠 Volver al inicio
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
