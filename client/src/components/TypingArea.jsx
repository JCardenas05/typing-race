import { useState, useEffect, useRef, useCallback } from 'react'

export default function TypingArea({ text, onProgress, startTime, disabled }) {
  const [typed, setTyped]       = useState('')
  const textareaRef             = useRef(null)
  const progressSentAt          = useRef(0)
  const lastReported            = useRef({ progress: -1, wpm: 0 })

  // Focus textarea when enabled
  useEffect(() => {
    if (!disabled) textareaRef.current?.focus()
  }, [disabled])

  const computeStats = useCallback((value) => {
    // Progress = length of correct sequential prefix
    let correct = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) correct++
      else break
    }
    const progress = (correct / text.length) * 100

    const elapsed = startTime ? (Date.now() - startTime) / 60000 : 0
    const wpm = elapsed > 0.01 ? Math.round((correct / 5) / elapsed) : 0

    return { progress, wpm, correct }
  }, [text, startTime])

  function handleChange(e) {
    if (disabled) return
    const value = e.target.value
    if (value.length > text.length) return

    setTyped(value)

    // Throttle progress updates to every 150ms
    const now = Date.now()
    if (now - progressSentAt.current < 150) return
    progressSentAt.current = now

    const { progress, wpm } = computeStats(value)
    if (progress !== lastReported.current.progress || wpm !== lastReported.current.wpm) {
      lastReported.current = { progress, wpm }
      onProgress(progress, wpm)
    }
  }

  // Render characters
  const chars = text.split('')
  const { correct } = computeStats(typed)

  return (
    <div className="relative">
      {/* Styled text display */}
      <div
        className="font-mono text-lg leading-9 bg-slate-900/60 rounded-xl p-5 border border-slate-700 cursor-text select-none mb-3 min-h-[120px]"
        onClick={() => textareaRef.current?.focus()}
      >
        {chars.map((char, i) => {
          let cls

          if (i < typed.length) {
            // Typed zone
            if (typed[i] === char) {
              cls = i < correct ? 'char-correct' : 'char-error'
            } else {
              cls = 'char-error'
            }
          } else if (i === typed.length) {
            cls = 'char-cursor'
          } else {
            cls = 'char-pending'
          }

          // Preserve spaces visually
          return (
            <span key={i} className={cls}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          )
        })}
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 text-sm text-slate-400 font-mono px-1">
        <span>
          Progreso:{' '}
          <span className="text-sky-400 font-bold">
            {Math.round((correct / text.length) * 100)}%
          </span>
        </span>
        <span>
          Velocidad:{' '}
          <span className="text-emerald-400 font-bold">
            {computeStats(typed).wpm} PPM
          </span>
        </span>
        <span>
          {correct}/{text.length} caracteres
        </span>
      </div>

      {/* Hidden textarea captures keystrokes */}
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
