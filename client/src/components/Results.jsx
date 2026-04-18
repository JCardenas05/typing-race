import { useRef } from 'react'
import { CHARACTERS, POSITION_MEDALS } from '../constants'

const CONFETTI_COLORS = ['#facc15', '#ec4899', '#06b6d4', '#10b981', '#7c3aed', '#f97316', '#ef4444', '#a855f7']

const RANK_STYLES = [
  { bg: 'rgba(250,204,21,0.15)',  border: 'rgba(250,204,21,0.4)',  label: 'text-yellow-300' },
  { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)', label: 'text-slate-300' },
  { bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.3)',  label: 'text-orange-400' },
]

export default function Results({ players, role, onPlayAgain }) {
  if (!players) return null

  const confettiPieces = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 9,
      duration: 3.5 + Math.random() * 3,
      isCircle: i % 3 === 0,
      rotate: Math.random() * 360,
    }))
  )

  const sorted = [...players].sort((a, b) => {
    if (a.finished && b.finished) return (a.position ?? 99) - (b.position ?? 99)
    if (a.finished) return -1
    if (b.finished) return 1
    return b.progress - a.progress
  })

  const winner = sorted[0]
  const winnerChar = CHARACTERS.find(c => c.id === winner?.character)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Confetti */}
      {confettiPieces.current.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: `${p.left}%`,
            top: '-12px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
            zIndex: 0,
            pointerEvents: 'none',
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}

      <div className="w-full max-w-2xl relative z-10">

        {/* Winner */}
        {winner && (
          <div className="text-center mb-8 animate-pop-in">
            <div className="text-8xl mb-4 animate-float">{winnerChar?.emoji ?? '🏆'}</div>
            <h1 className="font-fun text-5xl sm:text-6xl text-white mb-2">
              🥇 {winner.name} <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">gana!</span>
            </h1>
            <p className="text-slate-400 text-lg">
              <span className="text-cyan-400 font-black">{winner.wpm} PPM</span>
              {' · '}
              <span className="text-emerald-400 font-black">{Math.round(winner.progress)}%</span> completado
            </p>
          </div>
        )}

        {/* Scoreboard */}
        <div className="card-glass p-6 mb-6">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
            <span>🏆</span> Clasificación Final
          </h2>
          <div className="flex flex-col gap-3">
            {sorted.map((p, i) => {
              const char  = CHARACTERS.find(c => c.id === p.character)
              const medal = POSITION_MEDALS[i] ?? `${i + 1}.`
              const style = RANK_STYLES[i] ?? { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', label: 'text-slate-500' }

              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3 border transition-all"
                  style={{ background: style.bg, borderColor: style.border }}
                >
                  <span className="text-2xl w-8 text-center">{medal}</span>
                  <span className="text-3xl">{char?.emoji ?? '🎮'}</span>
                  <div className="flex-1">
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">
                      {p.finished ? '✓ Completó el texto' : `${Math.round(p.progress)}% completado`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-black text-xl tabular-nums">{p.wpm}</p>
                    <p className="text-xs text-slate-500">PPM</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {role === 'teacher' ? (
            <button
              onClick={onPlayAgain}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-fun text-2xl rounded-2xl transition-all shadow-lg shadow-purple-900/40 hover:shadow-glow-purple hover:scale-[1.02] active:scale-[0.98]"
            >
              🔄 Jugar de nuevo
            </button>
          ) : (
            <button
              onClick={onPlayAgain}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-fun text-xl rounded-2xl transition-all"
            >
              🏠 Volver al inicio
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
