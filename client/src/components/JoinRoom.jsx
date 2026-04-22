import { useState } from 'react'
import socket from '../socket'
import { CHARACTERS } from '../constants'

export default function JoinRoom({ onBack, onJoined }) {
  const [step, setStep]           = useState('code')
  const [code, setCode]           = useState('')
  const [name, setName]           = useState('')
  const [character, setCharacter] = useState(CHARACTERS[0].id)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  function handleCodeSubmit(e) {
    e.preventDefault()
    if (code.trim().length < 5) { setError('Ingresa el código de 5 letras que te dio el host.'); return }
    setError('')
    setStep('profile')
  }

  function handleJoin(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Escribe tu nombre.'); return }
    setLoading(true)
    setError('')
    socket.emit('join-room', { code: code.trim(), name: name.trim(), character }, ({ ok, text, error: err }) => {
      setLoading(false)
      if (ok) onJoined({ text, code: code.trim().toUpperCase() })
      else setError(err || 'Error al unirse a la sala.')
    })
  }

  const selectedChar = CHARACTERS.find(c => c.id === character)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-emerald-300/25 dark:bg-emerald-600/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        <button
          onClick={step === 'profile' ? () => { setStep('code'); setError('') } : onBack}
          className="mb-5 flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors font-semibold text-sm group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver
        </button>

        <div className="card-glass p-8">

          {step === 'code' && (
            <>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-4xl">🎟️</span>
                <h2 className="font-fun text-4xl text-slate-800 dark:text-white">Unirse a Sala</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-7 text-sm">
                Ingresa el código que te dio el host.
              </p>
              <form onSubmit={handleCodeSubmit}>
                <input
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  maxLength={5}
                  placeholder="ABCDE"
                  autoFocus
                  className="input-themed w-full border-2 rounded-2xl p-4 font-mono text-4xl text-center tracking-[0.5em] uppercase"
                />
                {error && <p className="text-red-500 dark:text-red-400 text-sm mt-3 font-semibold">⚠️ {error}</p>}
                <button
                  type="submit"
                  disabled={code.trim().length < 5}
                  className="w-full mt-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-700 dark:disabled:text-slate-500 disabled:cursor-not-allowed text-white font-fun text-xl py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/40 hover:shadow-glow-green hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continuar →
                </button>
              </form>
            </>
          )}

          {step === 'profile' && (
            <>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-4xl">🧑‍🚀</span>
                <h2 className="font-fun text-4xl text-slate-800 dark:text-white">Tu Perfil</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                Elige tu nombre y personaje para la carrera.
              </p>

              <form onSubmit={handleJoin}>
                <label className="block text-slate-600 dark:text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider">
                  Tu nombre
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={20}
                  placeholder="Ej: María, Carlos..."
                  autoFocus
                  className="input-themed w-full border-2 rounded-2xl p-3 font-semibold text-lg mb-6"
                />

                <label className="block text-slate-600 dark:text-slate-300 text-xs font-bold mb-3 uppercase tracking-wider">
                  Tu personaje
                </label>
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {CHARACTERS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCharacter(c.id)}
                      className="flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-200 hover:scale-110"
                      style={{
                        borderColor: character === c.id ? c.color : 'var(--input-border)',
                        background:  character === c.id ? `${c.color}18` : 'var(--input-bg)',
                        boxShadow:   character === c.id ? `0 0 16px ${c.color}45` : 'none',
                        transform:   character === c.id ? 'scale(1.08)' : undefined,
                      }}
                    >
                      <span className="text-3xl">{c.emoji}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight text-center">{c.label}</span>
                    </button>
                  ))}
                </div>

                <div
                  className="flex items-center gap-4 rounded-2xl p-4 mb-5 border"
                  style={{
                    background:   `${selectedChar?.color ?? '#7c3aed'}12`,
                    borderColor:  `${selectedChar?.color ?? '#7c3aed'}35`,
                  }}
                >
                  <span className="text-5xl">{selectedChar?.emoji}</span>
                  <div>
                    <p className="font-fun text-xl text-slate-800 dark:text-white">{name || '(tu nombre)'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedChar?.label}</p>
                  </div>
                  <div className="ml-auto text-2xl animate-float-slow">✨</div>
                </div>

                {error && <p className="text-red-500 dark:text-red-400 text-sm mb-4 font-semibold">⚠️ {error}</p>}

                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-700 dark:disabled:text-slate-500 disabled:cursor-not-allowed text-white font-fun text-xl py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/40 hover:shadow-glow-green hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? '⏳ Uniéndome...' : '🏁 ¡A la Carrera!'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
