import { useState, useEffect, useRef, useCallback } from 'react'

export default function TypingArea({ text, onProgress, startTime, disabled }) {
  const [typed, setTyped]  = useState('')
  const textareaRef        = useRef(null)
  const progressSentAt     = useRef(0)
  const lastReported       = useRef({ progress: -1, wpm: 0 })

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

  function handleChange(e) {
    if (disabled) return
    const value = e.target.value
    if (value.length > text.length) return
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
      {/* Styled text display */}
      <div
        className="font-mono text-lg leading-8 bg-black/30 rounded-2xl p-5 border border-white/10 cursor-text select-none mb-4"
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
      <div className="mb-4 h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
            boxShadow: progressPct > 0 ? '0 0 10px rgba(6,182,212,0.5)' : 'none',
          }}
        />
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 text-sm font-mono px-1">
        <span className="flex items-center gap-2">
          <span className="text-slate-500">Progreso</span>
          <span className="text-cyan-400 font-black text-base">{progressPct}%</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-slate-500">Velocidad</span>
          <span className="text-emerald-400 font-black text-base">{wpm} PPM</span>
        </span>
        <span className="text-slate-600 ml-auto">
          {correct}/{text.length}
        </span>
      </div>

      {/* Hidden textarea */}
      <textarea
        ref={textareaRef}
        value={typed}
        onChange={handleChange}
        disabled={disabled}
        aria-label="Área de escritura"
        className="absolute opacity-0 top-0 left-0 w-full h-full cursor-default resize-none"
        style={{ caretColor: 'transparent' }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>
  )
}
