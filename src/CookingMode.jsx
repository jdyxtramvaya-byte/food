import React, { useEffect, useMemo, useState } from 'react'
import { Check, Circle, Timer, Play, Pause, RotateCcw, ChefHat } from 'lucide-react'

function durationFromText(text) {
  const match = text.match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*(час(?:а|ов)?|ч\.?|минут(?:у|ы)?|мин\.?|секунд(?:у|ы)?|сек\.?)/i)
  if (!match) return null
  const amount = Number(match[2] || match[1])
  const unit = match[3].toLowerCase()
  const factor = /час|ч\./.test(unit) ? 3600 : /сек/.test(unit) ? 1 : 60
  return { seconds: amount * factor, label: match[0] }
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds)
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return m ? `${m}:${String(s).padStart(2, '0')}` : `0:${String(s).padStart(2, '0')}`
}

export default function CookingMode({ recipe, steps, tip, substitutions }) {
  const storageKey = `food-cooking-progress-${recipe.id}`
  const [completed, setCompleted] = useState(() => {
    try {
      const value = JSON.parse(window.localStorage.getItem(storageKey) || '[]')
      return Array.isArray(value) ? value : []
    } catch { return [] }
  })
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    try { window.localStorage.setItem(storageKey, JSON.stringify(completed)) } catch {}
  }, [storageKey, completed])

  useEffect(() => {
    if (!timer || timer.paused || timer.remaining <= 0) return undefined
    const id = window.setInterval(() => {
      setTimer(current => {
        if (!current || current.paused) return current
        const remaining = Math.max(0, current.remaining - 1)
        return { ...current, remaining, paused: remaining === 0 }
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [timer?.paused, timer?.remaining <= 0])

  const doneCount = completed.length
  const progress = steps.length ? Math.round(doneCount / steps.length * 100) : 0

  useEffect(() => {
    if (progress !== 100) return
    try {
      const history = JSON.parse(window.localStorage.getItem('food-cooking-history') || '[]')
      if (!Array.isArray(history) || history.some(entry => entry.id === recipe.id)) return
      history.unshift({ id: recipe.id, name: recipe.name, date: new Date().toISOString() })
      window.localStorage.setItem('food-cooking-history', JSON.stringify(history.slice(0, 50)))
    } catch {}
  }, [progress, recipe.id, recipe.name])

  const toggleStep = index => setCompleted(current =>
    current.includes(index) ? current.filter(item => item !== index) : [...current, index].sort((a, b) => a - b)
  )

  const startTimer = (step, index) => {
    const duration = durationFromText(step)
    if (!duration) return
    setTimer({ index, label: duration.label, remaining: duration.seconds, total: duration.seconds, paused: false })
  }

  return (
    <div className="cookingMode">
      <div className="cookingProgressHead">
        <div><span className="cookingEyebrow"><ChefHat size={14}/> РЕЖИМ ГОТОВКИ</span><strong>{doneCount} из {steps.length} шагов</strong></div>
        <span className="cookingProgressPercent">{progress}%</span>
      </div>
      <div className="cookingProgressTrack"><span style={{ width: `${progress}%` }}/></div>
      {timer && (
        <section className={timer.remaining === 0 ? 'cookingTimer finished' : 'cookingTimer'} aria-live="polite">
          <div className="cookingTimerIcon"><Timer size={20}/></div>
          <div className="cookingTimerText"><small>{timer.remaining === 0 ? 'ВРЕМЯ ВЫШЛО' : `ТАЙМЕР · ШАГ ${timer.index + 1}`}</small><strong>{formatTime(timer.remaining)}</strong><span>{timer.remaining === 0 ? 'Проверь готовность блюда' : `Установлено: ${timer.label}`}</span></div>
          <div className="cookingTimerActions">
            {timer.remaining > 0 && <button onClick={() => setTimer(current => ({ ...current, paused: !current.paused }))} aria-label={timer.paused ? 'Продолжить таймер' : 'Поставить таймер на паузу'}>{timer.paused ? <Play size={17}/> : <Pause size={17}/>}</button>}
            <button onClick={() => setTimer(null)} aria-label="Сбросить таймер"><RotateCcw size={17}/></button>
          </div>
        </section>
      )}
      <div className="cookingStepList">
        {steps.map((step, index) => {
          const isDone = completed.includes(index)
          const duration = durationFromText(step)
          return (
            <article className={isDone ? 'cookingStep done' : 'cookingStep'} key={index}>
              <button className="cookingStepCheck" onClick={() => toggleStep(index)} aria-label={isDone ? `Отметить шаг ${index + 1} невыполненным` : `Отметить шаг ${index + 1} выполненным`} aria-pressed={isDone}>
                {isDone ? <Check size={17}/> : <Circle size={19}/>}
              </button>
              <div className="cookingStepContent"><span className="cookingStepLabel">ШАГ {String(index + 1).padStart(2, '0')}</span><p>{step}</p>
                {duration && <button className="cookingStepTimer" onClick={() => startTimer(step, index)}><Timer size={14}/> Таймер на {duration.label}</button>}
              </div>
            </article>
          )
        })}
      </div>
      {progress === 100 && <div className="cookingFinished"><Check size={17}/> Готово! Приятного аппетита.</div>}
      {tip && <div className="recipeTip"><strong>Совет повара</strong><p>{tip}</p></div>}
      {substitutions && <div className="recipeTip"><strong>Чем заменить</strong><p>{substitutions}</p></div>}
      <button className="cookingReset" onClick={() => { setCompleted([]); setTimer(null) }}>Начать заново</button>
    </div>
  )
}
