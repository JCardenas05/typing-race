import { useState, useEffect, useRef } from 'react'
import socket from '../socket'
import RaceTrack from './RaceTrack'
import TypingArea from './TypingArea'

const COUNTDOWN_CONFIG = {
  3:    { bg: 'rgba(239,68,68,0.85)',    color: '#ffffff', shadow: 'rgba(239,68,68,0.9)',    ring: '#ef4444' },
  2:    { bg: 'rgba(245,158,11,0.85)',   color: '#ffffff', shadow: 'rgba(245,158,11,0.9)',   ring: '#f59e0b' },
  1:    { bg: 'rgba(34,197,94,0.85)',    color: '#ffffff', shadow: 'rgba(34,197,94,0.9)',    ring: '#22c55e' },
  'GO!':{ bg: 'rgba(6,182,212,0.85)',   color: '#ffffff', shadow: 'rgba(6,182,212,0.9)',    ring: '#06b6d4' },
}

export default function Race({ role, room, roomText, raceStart, onEnd }) {
  const [countdown, setCountdown] = useState(null)
  const [raceActive, setRaceActive] = useState(false)
  const timerRef = useRef(null)
  const sentProgress = useRef({ progress: -1, wpm: 0 })

  const players = room?.players ?? []

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
        timerRef.current = setTimeout(() => setCountdown(null), 900)
      }
    }
    tick()
    return () => clearTimeout(timerRef.current)
  }, [raceStart])

  function handleProgress(progress, wpm) {
    if (!raceActive) return
    if (progress === sentProgress.current.progress && wpm === sentProgress.current.wpm) return
    sentProgress.current = { progress, wpm }
    socket.emit('typing-progress', { progress, wpm })
  }

  const isFinished = room?.state === 'finished'
  const cfg = COUNTDOWN_CONFIG[countdown] ?? {}

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-4xl mx-auto w-full relative">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fun text-3xl text-white flex items-center gap-2">
          🏁 Carrera en curso
        </h2>
        {role === 'teacher' && !isFinished && (
          <button
            onClick={onEnd}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-500 border border-red-500/40 text-white text-sm font-bold rounded-xl transition-all"
          >
            Terminar carrera
          </button>
        )}
        {role === 'student' && (
          <div className={`text-sm font-bold px-4 py-2 rounded-xl border ${
            raceActive
              ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30 animate-pulse'
              : 'text-slate-400 bg-white/5 border-white/10'
          }`}>
            {raceActive ? '⌨️ ¡Escribe ya!' : '⏳ Espera...'}
          </div>
        )}
      </div>

      {/* Race track */}
      <div className="card-glass p-5 mb-5">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>🛣️</span> Pista de carrera
        </h3>
        <RaceTrack players={players} />
      </div>

      {/* Typing area */}
      {role === 'student' && (
        <div className="card-glass p-5">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>⌨️</span> Escribe el texto
          </h3>
          <TypingArea
            text={roomText}
            onProgress={handleProgress}
            startTime={raceStart}
            disabled={!raceActive || isFinished}
          />
          {!raceActive && !isFinished && (
            <p className="text-center text-slate-500 text-sm mt-3 animate-pulse">
              ¡Prepárate para escribir!
            </p>
          )}
        </div>
      )}

      {role === 'teacher' && (
        <div className="card-glass p-4 text-center text-slate-400 text-sm">
          👀 Estás viendo la carrera como espectador · {players.length} participantes
        </div>
      )}

      {/* Countdown overlay */}
      {countdown !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: cfg.bg, backdropFilter: 'blur(4px)' }}
        >
          {/* Pulsing ring */}
          <div
            className="absolute rounded-full animate-ping opacity-30"
            style={{
              width: '300px',
              height: '300px',
              border: `4px solid ${cfg.ring}`,
            }}
          />
          <div
            key={countdown}
            className="countdown-number font-fun leading-none select-none"
            style={{
              fontSize: 'clamp(8rem, 20vw, 14rem)',
              color: cfg.color,
              textShadow: `0 0 60px ${cfg.shadow}, 0 0 120px ${cfg.shadow}`,
            }}
          >
            {countdown}
          </div>
        </div>
      )}
    </div>
  )
}
