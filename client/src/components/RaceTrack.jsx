import { CHARACTERS } from '../constants'

export default function RaceTrack({ players }) {
  if (!players || players.length === 0) return null

  const sorted = [...players].sort((a, b) => b.progress - a.progress)

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((player, index) => {
        const char = CHARACTERS.find(c => c.id === player.character)
        const emoji = char?.emoji ?? '🎮'
        const color = char?.color ?? '#7c3aed'

        const pos = 4 + (player.progress / 100) * 88

        return (
          <div key={player.id}>
            {/* Name row */}
            <div className="flex items-center justify-between mb-1.5 px-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-black w-6 text-center rounded-md py-0.5"
                  style={{
                    color: index === 0 ? '#facc15' : index === 1 ? '#94a3b8' : index === 2 ? '#f97316' : '#64748b',
                    background: index === 0 ? 'rgba(250,204,21,0.15)' : 'transparent',
                  }}
                >
                  #{index + 1}
                </span>
                <span className="text-sm font-bold text-white">{player.name}</span>
                {player.finished && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold border border-yellow-500/30 animate-pop-in">
                    🏆 Terminó
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span>
                  <span className="text-cyan-400 font-black">{player.wpm}</span>
                  <span className="text-slate-500"> PPM</span>
                </span>
                <span>
                  <span className="font-black" style={{ color }}>{Math.round(player.progress)}</span>
                  <span className="text-slate-500">%</span>
                </span>
              </div>
            </div>

            {/* Track */}
            <div
              className="track-lane"
              style={{
                borderColor: `${color}30`,
                boxShadow: `inset 0 0 30px ${color}08`,
              }}
            >
              <div className="track-start" />
              <div className="track-finish" />

              {/* Progress fill */}
              <div
                className="absolute top-0 left-0 bottom-0 transition-all duration-300"
                style={{
                  width: `${pos}%`,
                  background: `linear-gradient(90deg, ${color}08, ${color}35)`,
                  borderRight: `2px solid ${color}50`,
                }}
              />

              {/* Racer */}
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
