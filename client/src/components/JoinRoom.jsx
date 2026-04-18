import { useState } from 'react'
import socket from '../socket'
import { CHARACTERS } from '../constants'

export default function JoinRoom({ onBack, onJoined }) {
  const [step, setStep]             = useState('code')   // 'code' | 'profile'
  const [code, setCode]             = useState('')
  const [name, setName]             = useState('')
  const [character, setCharacter]   = useState(CHARACTERS[0].id)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  function handleCodeSubmit(e) {
    e.preventDefault()
    if (code.trim().length < 5) {
      setError('Ingresa el código de 5 letras que te dio el docente.')
      return
    }
    setError('')
    setStep('profile')
  }

  function handleJoin(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Escribe tu nombre.')
      return
    }
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <button
          onClick={step === 'profile' ? () => { setStep('code'); setError('') } : onBack}
          className="mb-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
        >
          ← Volver
        </button>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">

          {/* STEP 1: Enter code */}
          {step === 'code' && (
            <>
              <h2 className="text-3xl font-black text-white mb-1">Unirse a Sala</h2>
              <p className="text-slate-400 mb-6 text-sm">Ingresa el código que te dio tu docente.</p>
              <form onSubmit={handleCodeSubmit}>
                <input
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  maxLength={5}
                  placeholder="ABCDE"
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-600 focus:border-emerald-500 outline-none rounded-xl p-4 text-white placeholder-slate-500 font-mono text-3xl text-center tracking-[0.4em] uppercase transition-colors"
                />
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                <button
                  type="submit"
                  disabled={code.trim().length < 5}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-lg"
                >
                  Continuar →
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Pick name + character */}
          {step === 'profile' && (
            <>
              <h2 className="text-3xl font-black text-white mb-1">Tu Perfil</h2>
              <p className="text-slate-400 mb-6 text-sm">Elige tu nombre y personaje para la carrera.</p>

              <form onSubmit={handleJoin}>
                <label className="block text-slate-300 text-sm font-semibold mb-1">Tu nombre</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={20}
                  placeholder="Ej: María, Carlos..."
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-600 focus:border-emerald-500 outline-none rounded-xl p-3 text-white placeholder-slate-500 font-semibold text-lg transition-colors mb-5"
                />

                <label className="block text-slate-300 text-sm font-semibold mb-2">Tu personaje</label>
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {CHARACTERS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCharacter(c.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                        character === c.id
                          ? 'border-emerald-400 bg-emerald-900/30 scale-105'
                          : 'border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-3xl">{c.emoji}</span>
                      <span className="text-xs text-slate-400 leading-tight text-center">{c.label}</span>
                    </button>
                  ))}
                </div>

                {/* Preview */}
                <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-3 mb-5">
                  <span className="text-4xl">{selectedChar?.emoji}</span>
                  <div>
                    <p className="font-bold text-white">{name || '(tu nombre)'}</p>
                    <p className="text-xs text-slate-400">{selectedChar?.label}</p>
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-lg"
                >
                  {loading ? 'Uniéndome...' : '¡Unirme a la carrera! →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
