import { useState, useEffect } from 'react'
import socket from './socket'
import Home from './components/Home'
import CreateRoom from './components/CreateRoom'
import JoinRoom from './components/JoinRoom'
import Lobby from './components/Lobby'
import Race from './components/Race'
import Results from './components/Results'

/*
  view states:
    'home' → 'create-room' → 'lobby-teacher' → 'race-teacher' → 'results'
    'home' → 'join-room'   → 'lobby-student' → 'race-student' → 'results'
*/

export default function App() {
  const [view, setView]         = useState('home')
  const [role, setRole]         = useState(null)    // 'teacher' | 'student'
  const [roomCode, setRoomCode] = useState(null)
  const [roomText, setRoomText] = useState('')
  const [room, setRoom]         = useState(null)    // latest room-update payload
  const [raceStart, setRaceStart] = useState(null)  // timestamp
  const [results, setResults]   = useState(null)
  const [error, setError]       = useState(null)

  useEffect(() => {
    socket.on('room-update', (data) => setRoom(data))

    socket.on('race-countdown', ({ startTime }) => {
      setRaceStart(startTime)
      setView(role === 'teacher' ? 'race-teacher' : 'race-student')
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

  function handleTeacherCreate({ text, code }) {
    setRole('teacher')
    setRoomCode(code)
    setRoomText(text)
    setView('lobby-teacher')
  }

  function handleStudentJoin({ text, code }) {
    setRole('student')
    setRoomCode(code)
    setRoomText(text)
    setView('lobby-student')
  }

  function handleStartRace() {
    socket.emit('start-race')
  }

  function handleEndRace() {
    socket.emit('end-race')
  }

  function handlePlayAgain() {
    if (role === 'teacher') {
      socket.emit('reset-room')
      setResults(null)
      setRaceStart(null)
      setView('lobby-teacher')
    } else {
      resetState()
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-xl font-semibold">
          {error}
          <button className="ml-4 underline" onClick={() => setError(null)}>Cerrar</button>
        </div>
      )}

      {view === 'home' && (
        <Home
          onTeacher={() => setView('create-room')}
          onStudent={() => setView('join-room')}
        />
      )}

      {view === 'create-room' && (
        <CreateRoom
          onBack={() => setView('home')}
          onCreated={handleTeacherCreate}
        />
      )}

      {view === 'join-room' && (
        <JoinRoom
          onBack={() => setView('home')}
          onJoined={handleStudentJoin}
        />
      )}

      {(view === 'lobby-teacher' || view === 'lobby-student') && (
        <Lobby
          role={role}
          roomCode={roomCode}
          roomText={roomText}
          room={room}
          onStart={handleStartRace}
          onBack={resetState}
        />
      )}

      {(view === 'race-teacher' || view === 'race-student') && (
        <Race
          role={role}
          room={room}
          roomText={roomText}
          raceStart={raceStart}
          onEnd={handleEndRace}
        />
      )}

      {view === 'results' && (
        <Results
          players={results}
          role={role}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}
