import { useState, useEffect, useRef } from 'react'
import socket from '../socket'
import RaceTrack from './RaceTrack'
import TypingArea from './TypingArea'

export default function Race({ role, room, roomText, raceStart, onEnd }) {
  const [countdown, setCountdown] = useState(null)  // 3 | 2 | 1 | 'GO!' | null
  const [raceActive, setRaceActive] = useState(false)
  const timerRef = useRef(null)
  const sentProgress = useRef({ progress: -1, wpm: 0 })

  const players = room?.players ?? []

  // Countdown management
  useEffect(() => {
    if (!raceStart) return

    function tick() {
      const remaining = Math.ceil((raceStart - Date.now()) / 1000)
      if (remaining > 0) {
        setCountdown(remaining)
        timerRef.current = setTimeout(tick, 200)
      } else {
        setCountdown('GO!')
        setRaceActive(true)
        timerRef.current = setTimeout(() => setCountdown(null), 800)
      }
    }
    tick()
    return () => clearTimeout(timerRef.current)
  }, [raceStart])

  function handleProgress(progress, wpm) {
    if (!raceActive) return
    // Avoid sending identical updates
    if (progress === sentProgress.current.progress && wpm === sentProgress.current.wpm) return
    sentProgress.current = { progress, wpm }
    socket.emit('typing-progress', { progress, wpm })
  }

  const isFinished = room?.state === 'finished'

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-4xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          🏁 Carrera en curso
        </h2>
        {role === 'teacher' && !isFinished && (
          <button
            onClick={onEnd}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Terminar carrera
          </button>
        )}
        {role === 'student' && (
          <div className="text-slate-400 text-sm">
            {raceActive ? '⌨️ ¡Escribe!' : '⏳ Espera...'}
          </div>
        )}
      </div>

      {/* Race track */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-6">
        <RaceTrack players={players} />
      </div>

      {/* Typing area — only for students */}
      {role === 'student' && (
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Escribe el texto
          </h3>
          <TypingArea
            text={roomText}
            onProgress={handleProgress}
            startTime={raceStart}
            disabled={!raceActive || isFinished}
          />
          {!raceActive && !isFinished && (
            <p className="text-center text-slate-500 text-sm mt-3">
              Esperando el inicio de la carrera...
            </p>
          )}
        </div>
      )}

      {/* Teacher spectator notice */}
      {role === 'teacher' && (
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 text-center text-slate-400 text-sm">
          Estás viendo la carrera como espectador · {players.length} participantes
        </div>
      )}

      {/* Countdown overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            key={countdown}
            className="countdown-number text-[10rem] font-black leading-none"
            style={{
              color: countdown === 'GO!' ? '#4ade80' : '#f1f5f9',
              textShadow: countdown === 'GO!'
                ? '0 0 40px #4ade80, 0 0 80px #4ade80'
                : '0 4px 30px rgba(0,0,0,0.5)',
            }}
          >
            {countdown}
          </div>
        </div>
      )}
    </div>
  )
}
