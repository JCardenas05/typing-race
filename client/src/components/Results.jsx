import { CHARACTERS, POSITION_MEDALS } from '../constants'

export default function Results({ players, role, onPlayAgain }) {
  if (!players) return null

  const sorted = [...players].sort((a, b) => {
    // Finished players ranked by position, then by wpm
    if (a.finished && b.finished) return (a.position ?? 99) - (b.position ?? 99)
    if (a.finished) return -1
    if (b.finished) return 1
    return b.progress - a.progress
  })

  const winner = sorted[0]
  const winnerChar = CHARACTERS.find(c => c.id === winner?.character)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">

        {/* Winner */}
        {winner && (
          <div className="text-center mb-8">
            <div className="text-7xl mb-2">{winnerChar?.emoji ?? '🏆'}</div>
            <h1 className="text-4xl font-black text-white">
              🥇 {winner.name} gana!
            </h1>
            <p className="text-slate-400 mt-1">
              {winner.wpm} PPM · {Math.round(winner.progress)}% completado
            </p>
          </div>
        )}

        {/* Podium / Scoreboard */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Clasificación Final
          </h2>
          <div className="flex flex-col gap-3">
            {sorted.map((p, i) => {
              const char = CHARACTERS.find(c => c.id === p.character)
              const medal = POSITION_MEDALS[i] ?? `${i + 1}.`
              const isFinished = p.finished

              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
                    i === 0
                      ? 'bg-yellow-500/20 border border-yellow-500/40'
                      : 'bg-slate-700/50'
                  }`}
                >
                  <span className="text-2xl w-8 text-center">{medal}</span>
                  <span className="text-3xl">{char?.emoji ?? '🎮'}</span>
                  <div className="flex-1">
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">
                      {isFinished ? '✓ Terminó' : `${Math.round(p.progress)}% completado`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sky-400 font-black text-lg tabular-nums">
                      {p.wpm} PPM
                    </p>
                    {!isFinished && (
                      <p className="text-xs text-slate-500">No terminó</p>
                    )}
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
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl rounded-xl transition-colors"
            >
              🔄 Jugar de nuevo
            </button>
          ) : (
            <button
              onClick={onPlayAgain}
              className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg rounded-xl transition-colors"
            >
              Volver al inicio
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
