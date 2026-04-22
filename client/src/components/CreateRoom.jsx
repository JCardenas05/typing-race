import { useState } from 'react'
import socket from '../socket'

const SAMPLE_TEXTS = [
  'El sol salía despacio por el horizonte, pintando el cielo de colores cálidos mientras los pájaros comenzaban a cantar.',
  'La tecnología avanza cada día y aprender a escribir rápido es una habilidad muy importante para el futuro.',
  'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo.',
  'Los computadores procesan información a gran velocidad y los programadores escriben código para darles instrucciones.',
]

const SAMPLE_COLORS = [
  'from-violet-500 to-indigo-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-teal-500',
]

export default function CreateRoom({ onBack, onCreated }) {
  const [text, setText]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function handleCreate(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (trimmed.length < 10)  { setError('El texto debe tener al menos 10 caracteres.'); return }
    if (trimmed.length > 500) { setError('El texto no puede superar los 500 caracteres.'); return }
    setLoading(true)
    setError('')
    socket.emit('create-room', { text: trimmed }, ({ ok, code, error: err }) => {
      setLoading(false)
      if (ok) onCreated({ text: trimmed, code })
      else setError(err || 'Error al crear la sala.')
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-violet-300/30 dark:bg-violet-600/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative">
        <button
          onClick={onBack}
          className="mb-5 flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors font-semibold text-sm group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver
        </button>

        <div className="card-glass p-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl">📝</span>
            <h2 className="font-fun text-4xl text-slate-800 dark:text-white">Crear Sala</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-7 text-sm ml-1">
            Escribe o pega el texto que los guests deberán mecanografiar.
          </p>

          <div className="mb-5">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">⚡ Textos de ejemplo</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TEXTS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setText(s)}
                  className={`text-xs bg-gradient-to-r ${SAMPLE_COLORS[i]} text-white px-4 py-2 rounded-xl shadow-md font-semibold transition-all hover:scale-105 active:scale-95`}
                >
                  Ejemplo {i + 1}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreate}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Escribe aquí el texto para la carrera..."
              rows={5}
              className="input-themed w-full border rounded-2xl p-4 font-mono text-sm resize-none"
            />
            <div className="flex items-center justify-between mt-2 mb-5">
              {error
                ? <p className="text-red-500 dark:text-red-400 text-sm font-semibold">⚠️ {error}</p>
                : <span />
              }
              <span className={`text-xs font-mono ${text.length > 500 ? 'text-red-500 dark:text-red-400' : 'text-slate-400'}`}>
                {text.length} / 500
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || text.trim().length < 10}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-700 dark:disabled:text-slate-500 disabled:cursor-not-allowed text-white font-fun text-xl py-4 rounded-2xl transition-all shadow-lg shadow-violet-200/50 dark:shadow-violet-900/40 hover:shadow-glow-purple hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? '⏳ Creando sala...' : '🚀 Crear Sala'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
