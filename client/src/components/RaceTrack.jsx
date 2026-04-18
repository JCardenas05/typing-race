import { CHARACTERS } from '../constants'

export default function RaceTrack({ players }) {
  if (!players || players.length === 0) return null
  const sorted = [...players].sort((a, b) => b.progress - a.progress)

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((player, index) => {
        const char  = CHARACTERS.find(c => c.id === player.character)
        const emoji = char?.emoji ?? '🎮'
        const color = char?.color ?? '#7c3aed'
        const pos   = 4 + (player.progress / 100) * 88

        return (
          <div key={player.id}>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-black w-6 text-center rounded-md py-0.5"
                  style={{
                    color: index === 0 ? '#7c3aed' : index === 1 ? '#64748b' : index === 2 ? '#f97316' : '#94a3b8',
                    background: index === 0 ? 'rgba(124,58,237,0.1)' : 'transparent',
                  }}
                >
                  #{index + 1}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{player.name}</span>
                {player.finished && (
                  <span className="finished-badge text-xs px-2 py-0.5 rounded-full font-bold border animate-pop-in">
                    🏆 Terminó
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span>
                  <span className="font-black" style={{ color }}>{player.wpm}</span>
                  <span className="text-slate-400 dark:text-slate-500"> PPM</span>
                </span>
                <span>
                  <span className="font-black" style={{ color }}>{Math.round(player.progress)}</span>
                  <span className="text-slate-400 dark:text-slate-500">%</span>
                </span>
              </div>
            </div>

            <div className="track-lane" style={{ borderColor: `${color}40` }}>
              <div className="track-start" />
              <div className="track-finish" />
              <div
                className="absolute top-0 left-0 bottom-0 transition-all duration-300"
                style={{
                  width:        `${pos}%`,
                  background:   `linear-gradient(90deg, ${color}15, ${color}45)`,
                  borderRight:  `2px solid ${color}60`,
                }}
              />
              <div
                className={`racer ${player.finished ? 'racer-finished' : ''}`}
                style={{ left: `calc(${pos}% - 20px)` }}
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
