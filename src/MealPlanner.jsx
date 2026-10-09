import React, { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ShoppingBasket, Trash2 } from 'lucide-react'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const readPlan = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem('food-weekly-meal-plan') || '{}')
    return saved && typeof saved === 'object' ? saved : {}
  } catch { return {} }
}

export default function MealPlanner({ recipes, pantry, shopping, setShopping }) {
  const [plan, setPlan] = useState(readPlan)
  useEffect(() => { try { window.localStorage.setItem('food-weekly-meal-plan', JSON.stringify(plan)) } catch {} }, [plan])
  const planned = useMemo(() => days.map(day => ({ day, recipe: recipes.find(recipe => String(recipe.id) === String(plan[day])) })).filter(item => item.recipe), [plan, recipes])
  const missing = useMemo(() => {
    const available = pantry.split(/[,;\n]+/).map(item => item.trim().toLocaleLowerCase('ru-RU')).filter(Boolean)
    const result = new Map()
    planned.forEach(({ recipe }) => recipe.ingredients.forEach(([name]) => {
      const key = String(name).trim().toLocaleLowerCase('ru-RU')
      if (key && !available.some(item => item.includes(key) || key.includes(item))) result.set(key, String(name))
    }))
    return [...result.values()]
  }, [planned, pantry])
  const addMissing = () => setShopping(current => {
    const known = new Set(current.map(item => String(item.name).toLocaleLowerCase('ru-RU')))
    return [...current, ...missing.filter(name => !known.has(name.toLocaleLowerCase('ru-RU'))).map(name => ({ name, checked: false }))]
  })

  return <div className="kitchenSection">
    <div className="kitchenSectionHead"><div><span>02 · ПЛАНИРОВАНИЕ</span><h3><CalendarDays size={19}/> Меню на неделю</h3></div><span className="kitchenCount">{planned.length}/7</span></div>
    <p className="kitchenSectionDesc">Выберите блюда на каждый день. Food соберёт список ингредиентов, которых нет в ваших запасах.</p>
    <div className="kitchenMealPlan">{days.map(day => <label className="kitchenMealDay" key={day}><span>{day}</span><select value={plan[day] || ''} onChange={event => setPlan(current => ({ ...current, [day]: event.target.value }))}><option value="">Пока без блюда</option>{recipes.map(recipe => <option key={recipe.id} value={recipe.id}>{recipe.name}</option>)}</select>{plan[day] && <button type="button" onClick={() => setPlan(current => { const next = { ...current }; delete next[day]; return next })} aria-label="Очистить день"><Trash2 size={14}/></button>}</label>)}</div>
    <div className="kitchenPlanSummary"><div><strong>{planned.length}</strong><span>дней запланировано</span></div><div><strong>{missing.length}</strong><span>ингредиентов к покупке</span></div></div>
    <button className="kitchenPlanAction" type="button" onClick={addMissing} disabled={!missing.length}><ShoppingBasket size={16}/>{missing.length ? 'Добавить недостающее в покупки' : 'Выберите блюда и проверьте запасы'}</button>
  </div>
}
