import { useState } from 'react'
import socket from '../socket'

const SAMPLE_TEXTS = [
  'El sol salía despacio por el horizonte, pintando el cielo de colores cálidos mientras los pájaros comenzaban a cantar.',
  'La tecnología avanza cada día y aprender a escribir rápido es una habilidad muy importante para el futuro.',
  'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo.',
  'Los computadores procesan información a gran velocidad y los programadores escriben código para darles instrucciones.',
]

export default function CreateRoom({ onBack, onCreated }) {
  const [text, setText]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function useSample(s) {
    setText(s)
  }

  function handleCreate(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (trimmed.length < 10) {
      setError('El texto debe tener al menos 10 caracteres.')
      return
    }
    if (trimmed.length > 500) {
      setError('El texto no puede superar los 500 caracteres.')
      return
    }
    setLoading(true)
    setError('')
    socket.emit('create-room', { text: trimmed }, ({ ok, code, error: err }) => {
      setLoading(false)
      if (ok) onCreated({ text: trimmed, code })
      else setError(err || 'Error al crear la sala.')
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <button onClick={onBack} className="mb-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
          ← Volver
        </button>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
          <h2 className="text-3xl font-black text-white mb-1">Crear Sala</h2>
          <p className="text-slate-400 mb-6 text-sm">Escribe o pega el texto que tus estudiantes deberán mecanografiar.</p>

          {/* Sample texts */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Textos de ejemplo</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TEXTS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => useSample(s)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
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
              className="w-full bg-slate-900 border border-slate-600 focus:border-sky-500 outline-none rounded-xl p-4 text-white placeholder-slate-500 font-mono text-sm resize-none transition-colors"
            />
            <div className="flex items-center justify-between mt-1 mb-4">
              {error
                ? <p className="text-red-400 text-sm">{error}</p>
                : <span />
              }
              <span className={`text-xs ${text.length > 500 ? 'text-red-400' : 'text-slate-500'}`}>
                {text.length} / 500
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || text.trim().length < 10}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-lg"
            >
              {loading ? 'Creando sala...' : 'Crear Sala →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
