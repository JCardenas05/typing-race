# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Install all dependencies:**
```bash
npm run install:all
```

**Run in development (server + client concurrently):**
```bash
npm run dev
```

**Run only the server (with file watching):**
```bash
npm run dev:server
```

**Run only the client (Vite dev server):**
```bash
npm run dev:client
```

**Build the client for production:**
```bash
npm --prefix client run build
```

**Start server in production (serves built client from `client/dist`):**
```bash
npm --prefix server run start
```

There are no tests configured.

## Architecture

This is a real-time multiplayer typing race app with a clear client/server split:

- **`server/index.js`** — Express + Socket.io server (ESM). All game logic lives here. Rooms are stored in a `Map` in memory (no database). The server also serves the production React build from `client/dist`.
- **`client/`** — React + Vite + Tailwind SPA.

### Data flow

1. Teacher connects → emits `create-room` with a text → gets back a 5-char room code.
2. Students connect → emit `join-room` with code + name + character.
3. Teacher emits `start-race` → server broadcasts `race-countdown` (with `startTime = Date.now() + 3000`) then transitions state to `racing` after 3.1s.
4. Students emit `typing-progress` → server rebroadcasts `room-update` to all room members.
5. Race ends when all players finish or teacher emits `end-race` → server broadcasts `race-finished`.
6. Teacher can emit `reset-room` to return to the lobby with all players still joined.

### Client state machine (`App.jsx`)

`view` drives which component renders. The full set of view names: `home`, `create-room`, `join-room`, `lobby-teacher`, `lobby-student`, `race-teacher`, `race-student`, `results`.

All socket event listeners are registered in `App.jsx`'s `useEffect`. Components receive handlers as props — they do not import `socket` directly except through `App.jsx`'s orchestration (the `Race` component is an exception and may access socket for `typing-progress`).

### Dev proxy

During development, `vite.config.js` proxies `/socket.io` to `http://localhost:3001` so the client socket connects via `io('/')` without hardcoding a port.

### Room state lifecycle (server)

```
waiting → countdown → racing → finished
                              ↑ (reset-room sends back to waiting)
```

Teacher disconnecting deletes the room and notifies all clients via `room-closed`.

### Character/display constants

`client/src/constants.js` holds the `CHARACTERS` array (emoji avatars with associated colors) and `POSITION_MEDALS`. Add new playable characters there.
