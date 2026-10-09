import React, { useEffect, useState } from 'react'
import { Check, Circle, Timer, Play, Pause, RotateCcw, ChefHat, ChevronLeft, ChevronRight, ClipboardCheck, ListChecks } from 'lucide-react'

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

function readArray(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch { return [] }
}

export default function CookingMode({ recipe, steps = [], tip, substitutions, ingredients = [], servings = 2 }) {
  const storageKey = `food-cooking-progress-${recipe.id}`
  const ingredientKey = `food-prep-ingredients-${recipe.id}`
  const [completed, setCompleted] = useState(() => readArray(storageKey))
  const [preparedIngredients, setPreparedIngredients] = useState(() => readArray(ingredientKey))
  const [guided, setGuided] = useState(false)
  const [currentStep, setCurrentStep] = useState(() => {
    try { return Math.max(0, Number(window.localStorage.getItem(`food-current-step-${recipe.id}`)) || 0) } catch { return 0 }
  })
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    try { window.localStorage.setItem(storageKey, JSON.stringify(completed)) } catch {}
  }, [storageKey, completed])

  useEffect(() => {
    try {
      window.localStorage.setItem(ingredientKey, JSON.stringify(preparedIngredients))
      window.localStorage.setItem(`food-current-step-${recipe.id}`, String(currentStep))
    } catch {}
  }, [ingredientKey, preparedIngredients, currentStep, recipe.id])

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

  const doneCount = completed.filter(index => index < steps.length).length
  const progress = steps.length ? Math.round(doneCount / steps.length * 100) : 0
  const activeStep = Math.min(currentStep, Math.max(0, steps.length - 1))

  useEffect(() => {
    if (progress !== 100 || !steps.length) return
    try {
      const history = readArray('food-cooking-history')
      if (history.some(entry => entry.id === recipe.id)) return
      history.unshift({ id: recipe.id, name: recipe.name, date: new Date().toISOString() })
      window.localStorage.setItem('food-cooking-history', JSON.stringify(history.slice(0, 50)))
    } catch {}
  }, [progress, recipe.id, recipe.name, steps.length])

  const toggleStep = index => setCompleted(current =>
    current.includes(index) ? current.filter(item => item !== index) : [...current, index].sort((a, b) => a - b)
  )
  const toggleIngredient = index => setPreparedIngredients(current =>
    current.includes(index) ? current.filter(item => item !== index) : [...current, index].sort((a, b) => a - b)
  )
  const startTimer = (step, index) => {
    const duration = durationFromText(step)
    if (!duration) return
    setTimer({ index, label: duration.label, remaining: duration.seconds, total: duration.seconds, paused: false })
  }
  const resetProgress = () => {
    setCompleted([])
    setPreparedIngredients([])
    setCurrentStep(0)
    setTimer(null)
    try {
      window.localStorage.removeItem(storageKey)
      window.localStorage.removeItem(ingredientKey)
      window.localStorage.removeItem(`food-current-step-${recipe.id}`)
    } catch {}
  }

  return (
    <div className="cookingMode">
      <div className="cookingProgressHead">
        <div><span className="cookingEyebrow"><ChefHat size={14}/> РЕЖИМ ГОТОВКИ</span><strong>{doneCount} из {steps.length} шагов</strong></div>
        <span className="cookingProgressPercent">{progress}%</span>
      </div>
      <div className="cookingProgressTrack"><span style={{ width: `${progress}%` }}/></div>

      {ingredients.length > 0 && (
        <section className="cookingPrep">
          <div className="cookingSectionTitle"><span className="cookingSectionIcon"><ClipboardCheck size={17}/></span><span><strong>Подготовить продукты</strong><small>{preparedIngredients.length} из {ingredients.length} подготовлено · на {servings} {servings === 1 ? 'порцию' : servings < 5 ? 'порции' : 'порций'}</small></span></div>
          <div className="cookingIngredientList">
            {ingredients.map((item, index) => {
              const checked = preparedIngredients.includes(index)
              return <button type="button" key={`${item.name}-${index}`} className={checked ? 'cookingIngredient checked' : 'cookingIngredient'} onClick={() => toggleIngredient(index)} aria-pressed={checked}>
                <span className="cookingIngredientCheck">{checked && <Check size={14}/>}</span><span>{item.name}</span><strong>{item.amount}</strong>
              </button>
            })}
          </div>
        </section>
      )}

      {timer && (
        <section className={timer.remaining === 0 ? 'cookingTimer finished' : 'cookingTimer'} aria-live="polite">
          <div className="cookingTimerIcon"><Timer size={20}/></div>
          <div className="cookingTimerText"><small>{timer.remaining === 0 ? 'ВРЕМЯ ВЫШЛО' : `ТАЙМЕР · ШАГ ${timer.index + 1}`}</small><strong>{formatTime(timer.remaining)}</strong><span>{timer.remaining === 0 ? 'Проверьте готовность блюда' : `Установлено: ${timer.label}`}</span></div>
          <div className="cookingTimerActions">
            {timer.remaining > 0 && <button onClick={() => setTimer(current => ({ ...current, paused: !current.paused }))} aria-label={timer.paused ? 'Продолжить таймер' : 'Поставить таймер на паузу'}>{timer.paused ? <Play size={17}/> : <Pause size={17}/>}</button>}
            <button onClick={() => setTimer(null)} aria-label="Сбросить таймер"><RotateCcw size={17}/></button>
          </div>
        </section>
      )}

      <div className="cookingModeSwitch">
        <div><ListChecks size={17}/><span><strong>{guided ? 'Пошаговое приготовление' : 'Все шаги рецепта'}</strong><small>{guided ? 'Сосредоточьтесь на текущем шаге' : 'Отмечайте выполненные шаги'}</small></span></div>
        <button type="button" onClick={() => setGuided(value => !value)}>{guided ? 'Все шаги' : 'Вести по шагам'}</button>
      </div>

      {guided && steps.length > 0 ? (
        <section className="guidedCookingStep">
          <div className="guidedCookingTop"><span>ШАГ {String(activeStep + 1).padStart(2, '0')}</span><span>{activeStep + 1} из {steps.length}</span></div>
          <div className="guidedCookingTrack">{steps.map((_, index) => <span key={index} className={index < activeStep ? 'done' : index === activeStep ? 'current' : ''}/>)}</div>
          <p className={completed.includes(activeStep) ? 'guidedCookingText done' : 'guidedCookingText'}>{steps[activeStep]}</p>
          {durationFromText(steps[activeStep]) && <button className="cookingStepTimer guidedTimerButton" onClick={() => startTimer(steps[activeStep], activeStep)}><Timer size={15}/> Запустить таймер · {durationFromText(steps[activeStep]).label}</button>}
          <button type="button" className={completed.includes(activeStep) ? 'guidedDoneButton checked' : 'guidedDoneButton'} onClick={() => toggleStep(activeStep)}>{completed.includes(activeStep) ? <><Check size={17}/> Шаг выполнен</> : <><Circle size={17}/> Отметить шаг выполненным</>}</button>
          <div className="guidedCookingNav"><button type="button" onClick={() => setCurrentStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}><ChevronLeft size={17}/> Назад</button><button type="button" onClick={() => { if (activeStep < steps.length - 1) setCurrentStep(activeStep + 1); else if (!completed.includes(activeStep)) toggleStep(activeStep) }}>{activeStep === steps.length - 1 ? 'Завершить' : 'Следующий шаг'} <ChevronRight size={17}/></button></div>
          {activeStep === steps.length - 1 && progress === 100 && <div className="cookingFinished"><Check size={17}/> Блюдо готово. Приятного аппетита!</div>}
        </section>
      ) : (
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
      )}
      {progress === 100 && <div className="cookingFinished"><Check size={17}/> Готово! Приятного аппетита.</div>}
      {tip && <div className="recipeTip"><strong>Совет повара</strong><p>{tip}</p></div>}
      {substitutions && <div className="recipeTip"><strong>Чем заменить</strong><p>{substitutions}</p></div>}
      <button className="cookingReset" onClick={resetProgress}>Сбросить прогресс и начать заново</button>
    </div>
  )
}
