import { useState, useEffect } from 'react'
import socket from './socket'
import Home from './components/Home'
import CreateRoom from './components/CreateRoom'
import JoinRoom from './components/JoinRoom'
import Lobby from './components/Lobby'
import Race from './components/Race'
import Results from './components/Results'

export default function App() {
  const [view, setView]           = useState('home')
  const [role, setRole]           = useState(null)
  const [roomCode, setRoomCode]   = useState(null)
  const [roomText, setRoomText]   = useState('')
  const [room, setRoom]           = useState(null)
  const [raceStart, setRaceStart] = useState(null)
  const [results, setResults]     = useState(null)
  const [error, setError]         = useState(null)

  // ── Theme ────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') ?? 'dark'
  )

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  // ── Socket events ────────────────────────────────────────────────
  useEffect(() => {
    socket.on('room-update', (data) => setRoom(data))

    socket.on('race-countdown', ({ startTime }) => {
      setRaceStart(startTime)
      setView(role === 'host' ? 'race-host' : 'race-guest')
    })

    socket.on('race-finished', ({ players }) => {
      setResults(players)
      setView('results')
    })

    socket.on('room-closed', ({ message }) => {
      setError(message)
      resetState()
    })

    return () => {
      socket.off('room-update')
      socket.off('race-countdown')
      socket.off('race-finished')
      socket.off('room-closed')
    }
  }, [role])

  function resetState() {
    setView('home')
    setRole(null)
    setRoomCode(null)
    setRoomText('')
    setRoom(null)
    setRaceStart(null)
    setResults(null)
  }

  function handleHostCreate({ text, code }) {
    setRole('host')
    setRoomCode(code)
    setRoomText(text)
    setView('lobby-host')
  }

  function handleGuestJoin({ text, code }) {
    setRole('guest')
    setRoomCode(code)
    setRoomText(text)
    setView('lobby-guest')
  }

  function handleStartRace()  { socket.emit('start-race') }
  function handleEndRace()    { socket.emit('end-race') }

  function handlePlayAgain() {
    if (role === 'host') {
      socket.emit('reset-room')
      setResults(null)
      setRaceStart(null)
      setView('lobby-host')
    } else {
      resetState()
    }
  }

  return (
    <div className="min-h-screen">

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        className="fixed top-4 right-4 z-50 w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95 shadow-lg border"
        style={{
          background: theme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.85)',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.20)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Error toast */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl font-semibold flex items-center gap-3">
          <span>{error}</span>
          <button className="underline text-sm opacity-80 hover:opacity-100" onClick={() => setError(null)}>
            Cerrar
          </button>
        </div>
      )}

      {view === 'home' && (
        <Home onHost={() => setView('create-room')} onGuest={() => setView('join-room')} />
      )}
      {view === 'create-room' && (
        <CreateRoom onBack={() => setView('home')} onCreated={handleHostCreate} />
      )}
      {view === 'join-room' && (
        <JoinRoom onBack={() => setView('home')} onJoined={handleGuestJoin} />
      )}
      {(view === 'lobby-host' || view === 'lobby-guest') && (
        <Lobby
          role={role} roomCode={roomCode} roomText={roomText}
          room={room} onStart={handleStartRace} onBack={resetState}
        />
      )}
      {(view === 'race-host' || view === 'race-guest') && (
        <Race
          role={role} room={room} roomText={roomText}
          raceStart={raceStart} onEnd={handleEndRace}
        />
      )}
      {view === 'results' && (
        <Results players={results} role={role} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  )
}
