import { CHARACTERS } from '../constants'

export default function RaceTrack({ players }) {
  if (!players || players.length === 0) return null

  // Sort by progress descending for display ranking
  const sorted = [...players].sort((a, b) => b.progress - a.progress)

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((player, index) => {
        const char = CHARACTERS.find(c => c.id === player.character)
        const emoji = char?.emoji ?? '🎮'
        const color = char?.color ?? '#94a3b8'

        // clamp racer position: start at 4%, max at 92% (so emoji is visible before finish)
        const pos = 4 + (player.progress / 100) * 88

        return (
          <div key={player.id}>
            {/* Name row */}
            <div className="flex items-center justify-between mb-1 px-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs font-bold w-4">#{index + 1}</span>
                <span className="text-sm font-bold text-white">{player.name}</span>
                {player.finished && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                    Terminó
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="tabular-nums">
                  <span className="text-sky-400 font-bold">{player.wpm}</span> PPM
                </span>
                <span className="tabular-nums">
                  <span style={{ color }}>{Math.round(player.progress)}</span>%
                </span>
              </div>
            </div>

            {/* Track */}
            <div className="track-lane">
              <div className="track-start" />
              <div className="track-finish" />

              {/* Progress fill */}
              <div
                className="absolute top-0 left-0 bottom-0 opacity-20 transition-all duration-300"
                style={{
                  width: `${pos}%`,
                  background: `linear-gradient(90deg, ${color}44, ${color})`,
                }}
              />

              {/* Racer */}
              <div
                className={`racer ${player.finished ? 'racer-finished' : ''}`}
                style={{ left: `calc(${pos}% - 18px)` }}
                title={player.name}
              >
                {emoji}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
