import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Circle, Timer, Play, Pause, RotateCcw, ChefHat, ChevronLeft, ChevronRight, ClipboardCheck, X, ListChecks } from 'lucide-react'

function durationFromText(text) {
  const match = String(text).match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*(час(?:а|ов)?|ч\.?|минут(?:у|ы)?|мин\.?|секунд(?:у|ы)?|сек\.?)/i)
  if (!match) return null
  const amount = Number(match[2] || match[1])
  const unit = match[3].toLowerCase()
  const factor = /час|ч\./.test(unit) ? 3600 : /сек/.test(unit) ? 1 : 60
  return { seconds: amount * factor, label: match[0] }
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds)
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`
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
  const [allSteps, setAllSteps] = useState(false)
  const [finished, setFinished] = useState(false)

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
    if (duration) setTimer({ index, label: duration.label, remaining: duration.seconds, paused: false })
  }
  const resetProgress = () => {
    setCompleted([])
    setPreparedIngredients([])
    setCurrentStep(0)
    setTimer(null)
    setFinished(false)
    try {
      window.localStorage.removeItem(storageKey)
      window.localStorage.removeItem(ingredientKey)
      window.localStorage.removeItem(`food-current-step-${recipe.id}`)
    } catch {}
  }
  const closeGuided = () => {
    setGuided(false)
    setFinished(false)
  }

  useEffect(() => {
    if (!guided) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setGuided(false)
        setFinished(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [guided])

  return (
    <div className="cookingMode">
      <div className="cookingProgressHead">
        <div><span className="cookingEyebrow"><ChefHat size={14}/> РЕЖИМ ГОТОВКИ</span><strong>{doneCount} из {steps.length} шагов пройдено</strong></div>
        <span className="cookingProgressPercent">{progress}%</span>
      </div>
      <div className="cookingProgressTrack"><span style={{ width: `${progress}%` }}/></div>

      {ingredients.length > 0 && <section className="cookingPrep">
        <div className="cookingSectionTitle"><span className="cookingSectionIcon"><ClipboardCheck size={17}/></span><span><strong>Подготовить продукты</strong><small>{preparedIngredients.length} из {ingredients.length} · на {servings} {servings === 1 ? 'порцию' : servings < 5 ? 'порции' : 'порций'}</small></span></div>
        <div className="cookingIngredientList">
          {ingredients.map((item, index) => {
            const checked = preparedIngredients.includes(index)
            return <button type="button" key={`${item.name}-${index}`} className={checked ? 'cookingIngredient checked' : 'cookingIngredient'} onClick={() => toggleIngredient(index)} aria-pressed={checked}>
              <span className="cookingIngredientCheck">{checked && <Check size={14}/>}</span><span>{item.name}</span><strong>{item.amount}</strong>
            </button>
          })}
        </div>
      </section>}

      <div className="cookingLaunchCard">
        <div className="cookingLaunchIcon"><ChefHat size={22}/></div>
        <div className="cookingLaunchCopy"><strong>Готовим шаг за шагом</strong><span>Отдельный экран, таймер и крупные инструкции — удобно, когда руки заняты.</span></div>
        <button type="button" onClick={() => { setGuided(true); setFinished(false) }}>{progress === 0 ? 'Начать готовить' : 'Продолжить'} <ChevronRight size={16}/></button>
      </div>

      {progress === 100 && <div className="cookingFinished"><Check size={17}/> Готово! Приятного аппетита.</div>}
      {tip && <div className="recipeTip"><strong>Совет повара</strong><p>{tip}</p></div>}
      {substitutions && <div className="recipeTip"><strong>Чем заменить</strong><p>{substitutions}</p></div>}
      <button className="cookingReset" onClick={resetProgress}>Сбросить прогресс и начать заново</button>

      {guided && createPortal(<div className="cookingFullscreen" role="dialog" aria-modal="true" aria-label={`Готовим: ${recipe.name}`}>
        <header className="cookingFullscreenHeader">
          <button type="button" className="cookingCloseButton" onClick={closeGuided} aria-label="Закрыть режим готовки"><X size={21}/></button>
          <div className="cookingFullscreenBrand"><span>FOOD · РЕЖИМ ГОТОВКИ</span><strong>{recipe.name}</strong></div>
          <span className="cookingFullscreenServings">{servings} порц.</span>
        </header>
        <div className="cookingFullscreenProgress">
          <div><span>ВАШ ПРОГРЕСС</span><strong>{progress}%</strong></div>
          <div className="cookingFullscreenTrack"><span style={{ width: `${progress}%` }}/></div>
        </div>

        {finished || (progress === 100 && activeStep === steps.length - 1) ? <section className="cookingCompletion">
          <div className="cookingCompletionIcon"><Check size={32}/></div>
          <span>ВСЕ ШАГИ ПОЗАДИ</span><h2>Блюдо готово.</h2><p>Можно накрывать на стол. Приятного аппетита всей семье!</p>
          <button type="button" onClick={closeGuided}>Вернуться к рецепту</button>
        </section> : <>
          <main className="cookingFullscreenMain">
            <div className="cookingFullscreenStepMeta"><span>ШАГ {String(activeStep + 1).padStart(2, '0')}</span><span>{activeStep + 1} ИЗ {steps.length}</span></div>
            <div className="cookingFullscreenSegments" style={{ "--step-count": steps.length }}>{steps.map((_, index) => <span key={index} className={index < activeStep ? 'done' : index === activeStep ? 'current' : ''}/>)}</div>
            {recipe.image && <div className="cookingFullscreenImage"><img src={recipe.image} alt={recipe.name}/><span><ChefHat size={14}/> ГОТОВИМ ВМЕСТЕ</span></div>}
            <p className={completed.includes(activeStep) ? 'cookingFullscreenInstruction completed' : 'cookingFullscreenInstruction'}>{steps[activeStep]}</p>
            {timer && <section className={timer.remaining === 0 ? 'cookingTimer finished fullscreenTimer' : 'cookingTimer fullscreenTimer'} aria-live="polite">
              <div className="cookingTimerIcon"><Timer size={20}/></div><div className="cookingTimerText"><small>{timer.remaining === 0 ? 'ВРЕМЯ ВЫШЛО' : `ТАЙМЕР · ШАГ ${timer.index + 1}`}</small><strong>{formatTime(timer.remaining)}</strong><span>{timer.remaining === 0 ? 'Проверьте готовность блюда' : `Установлено: ${timer.label}`}</span></div>
              <div className="cookingTimerActions">{timer.remaining > 0 && <button onClick={() => setTimer(current => ({ ...current, paused: !current.paused }))} aria-label={timer.paused ? 'Продолжить таймер' : 'Пауза'}>{timer.paused ? <Play size={17}/> : <Pause size={17}/>}</button>}<button onClick={() => setTimer(null)} aria-label="Сбросить таймер"><RotateCcw size={17}/></button></div>
            </section>}
            {durationFromText(steps[activeStep]) && <button type="button" className="cookingFullscreenTimerButton" onClick={() => startTimer(steps[activeStep], activeStep)}><Timer size={17}/> Запустить таймер · {durationFromText(steps[activeStep]).label}</button>}
            <button type="button" className={completed.includes(activeStep) ? 'cookingFullscreenDone checked' : 'cookingFullscreenDone'} onClick={() => toggleStep(activeStep)}>{completed.includes(activeStep) ? <><Check size={18}/> Шаг выполнен</> : <><Circle size={18}/> Отметить шаг выполненным</>}</button>
          </main>
          <footer className="cookingFullscreenFooter">
            <button type="button" onClick={() => setCurrentStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}><ChevronLeft size={18}/> Назад</button>
            <button type="button" className="cookingNextButton" onClick={() => { if (activeStep < steps.length - 1) setCurrentStep(activeStep + 1); else { if (!completed.includes(activeStep)) toggleStep(activeStep); setFinished(true) } }}>{activeStep === steps.length - 1 ? 'Завершить' : 'Следующий шаг'} <ChevronRight size={18}/></button>
          </footer>
          <div className="cookingFullscreenExtras">
            <button type="button" onClick={() => setAllSteps(value => !value)}><ListChecks size={15}/>{allSteps ? 'Скрыть список шагов' : 'Все шаги рецепта'}</button>
            {allSteps && <div className="cookingFullscreenStepList">{steps.map((step, index) => <button type="button" key={index} className={index === activeStep ? 'active' : ''} onClick={() => { setCurrentStep(index); setAllSteps(false) }}><span>{completed.includes(index) ? <Check size={15}/> : String(index + 1).padStart(2, '0')}</span>{step}</button>)}</div>}
          </div>
        </>}
      </div>, document.body)}
    </div>
  )
}
