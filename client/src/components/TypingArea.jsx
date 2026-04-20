import { useState, useEffect, useRef, useCallback } from 'react'

export default function TypingArea({ text, onProgress, startTime, disabled }) {
  const [typed, setTyped]        = useState('')
  const [capsLock, setCapsLock]  = useState(false)
  const [shake, setShake]        = useState(false)
  const textareaRef              = useRef(null)
  const progressSentAt           = useRef(0)
  const lastReported             = useRef({ progress: -1, wpm: 0 })
  const composingRef             = useRef(false)

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus()
  }, [disabled])

  const computeStats = useCallback((value) => {
    let correct = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) correct++
      else break
    }
    const progress = (correct / text.length) * 100
    const elapsed  = startTime ? (Date.now() - startTime) / 60000 : 0
    const wpm      = elapsed > 0.01 ? Math.round((correct / 5) / elapsed) : 0
    return { progress, wpm, correct }
  }, [text, startTime])

  function handleKeyDown(e) {
    if (e.getModifierState) setCapsLock(e.getModifierState('CapsLock'))
  }

  function triggerShake() {
    setShake(false)
    requestAnimationFrame(() => setShake(true))
    setTimeout(() => setShake(false), 400)
  }

  function handleChange(e) {
    if (disabled) return
    const value = e.target.value
    if (value.length > text.length) return
    if (!composingRef.current && value.length > typed.length && value[value.length - 1] !== text[value.length - 1]) {
      triggerShake()
      return
    }
    setTyped(value)

    const now = Date.now()
    if (now - progressSentAt.current < 150) return
    progressSentAt.current = now

    const { progress, wpm } = computeStats(value)
    if (progress !== lastReported.current.progress || wpm !== lastReported.current.wpm) {
      lastReported.current = { progress, wpm }
      onProgress(progress, wpm)
    }
  }

  const chars = text.split('')
  const { correct, wpm } = computeStats(typed)
  const progressPct = Math.round((correct / text.length) * 100)

  return (
    <div className="relative">
      {/* Text display */}
      <div
        className={`typing-display font-mono text-lg leading-8 rounded-2xl p-5 cursor-text select-none mb-4 transition-all${shake ? ' typing-display-shake' : ''}`}
        style={{ overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal' }}
        onClick={() => textareaRef.current?.focus()}
      >
        {chars.map((char, i) => {
          let cls
          if (i < typed.length) {
            cls = typed[i] === char && i < correct ? 'char-correct' : 'char-error'
          } else if (i === typed.length) {
            cls = 'char-cursor'
          } else {
            cls = 'char-pending'
          }
          return (
            <span key={i} className={cls}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="progress-container mb-4 h-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width:     `${progressPct}%`,
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
            boxShadow:  progressPct > 0 ? '0 0 8px rgba(124,58,237,0.4)' : 'none',
          }}
        />
      </div>

      {/* Caps Lock warning */}
      {capsLock && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-300 dark:bg-amber-500/10 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 text-sm font-semibold">
          <span>⚠️</span> Bloq Mayús activado — puede causar errores al escribir
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-6 text-sm font-mono px-1">
        <span className="flex items-center gap-2">
          <span className="text-slate-400">Progreso</span>
          <span className="text-violet-600 dark:text-cyan-400 font-black text-base">{progressPct}%</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-slate-400">Velocidad</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-base">{wpm} PPM</span>
        </span>
        <span className="text-slate-400 ml-auto">{correct}/{text.length}</span>
      </div>

      {/* Hidden textarea */}
      <textarea
        ref={textareaRef}
        value={typed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => { composingRef.current = true }}
        onCompositionEnd={() => { composingRef.current = false }}
        disabled={disabled}
        aria-label="Área de escritura"
        className="absolute opacity-0 top-0 left-0 w-full h-full cursor-default resize-none"
        style={{ caretColor: 'transparent' }}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
      />
    </div>
  )
}
