import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' },
})

// Serve built React app
app.use(express.static(path.join(__dirname, '../client/dist')))
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
)

// rooms: Map<code, Room>
const rooms = new Map()

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code
  do {
    code = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  } while (rooms.has(code))
  return code
}

function serializeRoom(room) {
  return {
    code: room.code,
    state: room.state,
    text: room.text,
    players: [...room.players.values()],
  }
}

io.on('connection', (socket) => {
  let roomCode = null
  let role = null // 'host' | 'guest'

  // ── Teacher: create room ──────────────────────────────────────────────────
  socket.on('create-room', ({ text }, cb) => {
    const code = generateCode()
    rooms.set(code, {
      code,
      text: text.trim(),
      state: 'waiting', // 'waiting' | 'countdown' | 'racing' | 'finished'
      host: socket.id,
      players: new Map(),
      startTime: null,
      countdownTimer: null,
    })
    roomCode = code
    role = 'host'
    socket.join(code)
    cb({ ok: true, code })
  })

  // ── Student: join room ────────────────────────────────────────────────────
  socket.on('join-room', ({ code, name, character }, cb) => {
    const upper = code.toUpperCase()
    const room = rooms.get(upper)
    if (!room) return cb({ ok: false, error: 'Sala no encontrada. Verifica el código.' })
    if (room.state !== 'waiting') return cb({ ok: false, error: 'La carrera ya comenzó. Espera la próxima.' })

    room.players.set(socket.id, {
      id: socket.id,
      name,
      character,
      progress: 0,
      wpm: 0,
      finished: false,
      position: null, // finishing position
    })

    roomCode = upper
    role = 'guest'
    socket.join(upper)

    io.to(upper).emit('room-update', serializeRoom(room))
    cb({ ok: true, text: room.text })
  })

  // ── Teacher: start race (triggers 3-2-1 countdown) ───────────────────────
  socket.on('start-race', () => {
    if (!roomCode) return
    const room = rooms.get(roomCode)
    if (!room || room.host !== socket.id || room.state !== 'waiting') return
    if (room.players.size === 0) return

    room.state = 'countdown'
    // startTime is 5 seconds from now — gives all clients time to mount before the 3-2-1 overlay
    room.startTime = Date.now() + 5000
    io.to(roomCode).emit('race-countdown', { startTime: room.startTime })
    io.to(roomCode).emit('room-update', serializeRoom(room))

    // Auto-transition to racing state
    room.countdownTimer = setTimeout(() => {
      room.state = 'racing'
      io.to(roomCode).emit('room-update', serializeRoom(room))
    }, 5100)
  })

  // ── Student: typing progress update ──────────────────────────────────────
  socket.on('typing-progress', ({ progress, wpm }) => {
    if (!roomCode) return
    const room = rooms.get(roomCode)
    if (!room || room.state !== 'racing') return
    const player = room.players.get(socket.id)
    if (!player || player.finished) return

    player.progress = Math.min(progress, 100)
    player.wpm = wpm

    if (player.progress >= 100) {
      player.finished = true
      const finishedCount = [...room.players.values()].filter(p => p.finished).length
      player.position = finishedCount
    }

    io.to(roomCode).emit('room-update', serializeRoom(room))

    // End race when all players finish
    const allDone = [...room.players.values()].every(p => p.finished)
    if (allDone) {
      room.state = 'finished'
      io.to(roomCode).emit('race-finished', { players: [...room.players.values()] })
      io.to(roomCode).emit('room-update', serializeRoom(room))
    }
  })

  // ── Teacher: end race manually ────────────────────────────────────────────
  socket.on('end-race', () => {
    if (!roomCode) return
    const room = rooms.get(roomCode)
    if (!room || room.host !== socket.id) return
    room.state = 'finished'
    io.to(roomCode).emit('race-finished', { players: [...room.players.values()] })
    io.to(roomCode).emit('room-update', serializeRoom(room))
  })

  // ── Teacher: reset room ───────────────────────────────────────────────────
  socket.on('reset-room', () => {
    if (!roomCode) return
    const room = rooms.get(roomCode)
    if (!room || room.host !== socket.id) return

    if (room.countdownTimer) clearTimeout(room.countdownTimer)
    room.state = 'waiting'
    room.startTime = null
    room.players.forEach(p => {
      p.progress = 0
      p.wpm = 0
      p.finished = false
      p.position = null
    })
    io.to(roomCode).emit('room-update', serializeRoom(room))
  })

  // ── Disconnect ────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    if (!roomCode) return
    const room = rooms.get(roomCode)
    if (!room) return

    if (role === 'host') {
      if (room.countdownTimer) clearTimeout(room.countdownTimer)
      io.to(roomCode).emit('room-closed', { message: 'El host abandonó la sala.' })
      rooms.delete(roomCode)
    } else {
      room.players.delete(socket.id)
      io.to(roomCode).emit('room-update', serializeRoom(room))
    }
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`))
