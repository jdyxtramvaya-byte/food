import React, { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ShoppingBasket, Trash2, WandSparkles, UsersRound, Check, RefreshCw } from 'lucide-react'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const slots = [
  { id: 'breakfast', label: 'Завтрак' },
  { id: 'lunch', label: 'Обед' },
  { id: 'dinner', label: 'Ужин' },
]
const pantryKey = 'food-pantry-ingredients'
const planKey = 'food-weekly-meal-plan'
const stapleWords = ['соль', 'вода', 'масло', 'перец', 'сахар']
const normalize = value => String(value || '').toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/[^а-яa-z0-9]+/g, ' ').trim()
const aliases = [
  ['картофель', 'картошка'], ['яйца', 'яйцо'], ['курица', 'куриное филе', 'куриные бедра', 'куриные бёдра'],
  ['лук', 'лук репчатый'], ['масло', 'растительное масло', 'сливочное масло'], ['сыр', 'пармезан', 'моцарелла'],
  ['мясо', 'говядина', 'свинина', 'фарш'], ['паста', 'макароны', 'спагетти'], ['помидоры', 'томат']
]
const equivalent = (a, b) => {
  const left = normalize(a), right = normalize(b)
  if (!left || !right) return false
  if (left === right || left.includes(right) || right.includes(left)) return true
  return aliases.some(group => group.some(item => normalize(item) === left) && group.some(item => normalize(item) === right))
}
const readPlan = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(planKey) || '{}')
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {}
  } catch { return {} }
}
const recipeCategory = recipe => normalize(recipe?.category)
const suitable = (recipe, slot) => {
  const category = recipeCategory(recipe)
  const name = normalize(recipe?.name)
  if (slot === 'breakfast') return category.includes('завтрак') || /омлет|блин|сырник|каша|гранола|тост|олад/.test(name)
  if (slot === 'lunch') return category.includes('перв') || category.includes('суп') || category.includes('салат')
  return category.includes('втор') || category.includes('горяч') || category.includes('гарнир')
}
const quantityText = (amount, unit) => {
  const rounded = Math.round(amount * 10) / 10
  const value = Number.isInteger(rounded) ? String(rounded) : String(rounded).replace('.', ',')
  return [value, unit].filter(Boolean).join(' ')
}

export default function MealPlanner({ recipes = [], pantry = '', shopping = [], setShopping }) {
  const [plan, setPlan] = useState(readPlan)
  const [servings, setServings] = useState(() => {
    try { return Math.min(12, Math.max(1, Number(window.localStorage.getItem('food-plan-servings')) || 4)) } catch { return 4 }
  })
  const [notice, setNotice] = useState('')
  useEffect(() => { try { window.localStorage.setItem(planKey, JSON.stringify(plan)) } catch {} }, [plan])
  useEffect(() => { try { window.localStorage.setItem('food-plan-servings', String(servings)) } catch {} }, [servings])

  // Migrate the previous one-dish-per-day format into the lunch slot without losing it.
  useEffect(() => {
    setPlan(current => {
      let changed = false
      const next = { ...current }
      days.forEach(day => {
        if (typeof next[day] === 'string' && next[day] && !next[day + '|lunch']) {
          next[day + '|lunch'] = next[day]
          delete next[day]
          changed = true
        }
      })
      return changed ? next : current
    })
  }, [])

  const pantryItems = useMemo(() => pantry.split(/[,;\n]+/).map(item => item.trim()).filter(Boolean), [pantry])
  const planned = useMemo(() => days.flatMap(day => slots.map(slot => {
    const id = plan[day + '|' + slot.id]
    return { day, slot, recipe: recipes.find(recipe => String(recipe.id) === String(id)) }
  })).filter(item => item.recipe), [plan, recipes])
  const missing = useMemo(() => {
    const result = new Map()
    planned.forEach(({ recipe }) => {
      const base = Math.max(1, Number(recipe.baseServings) || 4)
      ;(recipe.ingredients || []).forEach(row => {
        if (!Array.isArray(row) || !row[0]) return
        const [name, amount, unit] = row
        const ingredient = String(name).trim()
        if (!ingredient || stapleWords.some(word => normalize(ingredient) === word)) return
        if (pantryItems.some(item => equivalent(item, ingredient))) return
        const key = normalize(ingredient) + '|' + normalize(unit)
        const quantity = Number(amount)
        const scaled = Number.isFinite(quantity) ? quantity * servings / base : 0
        const old = result.get(key)
        result.set(key, {
          name: ingredient,
          unit: unit || '',
          amount: (old?.amount || 0) + scaled,
          hasQuantity: Number.isFinite(quantity) && quantity > 0,
        })
      })
    })
    return [...result.values()].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }, [planned, pantryItems, servings])
  const shoppingCount = missing.length
  const plannedCount = planned.length
  const completion = Math.round(plannedCount / 21 * 100)

  const setMeal = (day, slot, value) => {
    setNotice('')
    setPlan(current => {
      const next = { ...current }
      const key = day + '|' + slot
      if (value) next[key] = value
      else delete next[key]
      return next
    })
  }

  const generateWeek = () => {
    if (!recipes.length) {
      setNotice('Пока нет доступных рецептов для планирования.')
      return
    }
    const next = {}
    const used = new Set()
    const available = pantryItems
    days.forEach((day, dayIndex) => {
      slots.forEach((slot, slotIndex) => {
        const ranked = recipes.map((recipe, index) => {
          const ingredients = (recipe.ingredients || []).map(row => row?.[0]).filter(Boolean)
          const matches = ingredients.filter(name => available.some(item => equivalent(item, name))).length
          const coverage = ingredients.length ? matches / ingredients.length : 0
          const categoryBonus = suitable(recipe, slot.id) ? 0.28 : -0.12
          const repeatPenalty = used.has(String(recipe.id)) ? 1.2 : 0
          // Stable variation avoids choosing the same top-ranked recipe every time.
          const variety = ((index * 7 + dayIndex * 3 + slotIndex * 5) % Math.max(recipes.length, 1)) / Math.max(recipes.length, 1) * 0.07
          return { recipe, score: coverage + categoryBonus - repeatPenalty + variety, index }
        }).sort((a, b) => b.score - a.score || a.index - b.index)
        const chosen = ranked[0]?.recipe
        if (chosen) {
          next[day + '|' + slot.id] = String(chosen.id)
          used.add(String(chosen.id))
        }
      })
    })
    setPlan(next)
    setNotice('Готово: меню на 7 дней составлено. Можно заменить любое блюдо вручную.')
  }

  const addMissing = () => {
    if (!setShopping || !missing.length) return
    setShopping(current => {
      const next = [...current]
      missing.forEach(item => {
        const label = item.hasQuantity ? item.name + ' — ' + quantityText(item.amount, item.unit) : item.name
        const key = normalize(item.name)
        const existing = next.find(row => normalize(row.name) === key)
        if (!existing) next.push({ name: item.name, quantity: item.hasQuantity ? quantityText(item.amount, item.unit) : '', checked: false })
        else if (item.hasQuantity && !existing.checked) existing.quantity = quantityText(item.amount, item.unit)
      })
      return next
    })
    setNotice('Недостающие ингредиенты добавлены в общий список покупок.')
  }

  return <section className="kitchenSection mealPlannerPro">
    <div className="kitchenSectionHead">
      <div><span>02 · ПЛАНИРОВАНИЕ</span><h3><CalendarDays size={19}/> Меню на неделю</h3></div>
      <span className="kitchenCount">{plannedCount}/21</span>
    </div>
    <p className="kitchenSectionDesc">Food подберёт меню под ваши запасы и соберёт ингредиенты для всей недели — без повторного подсчёта одинаковых продуктов.</p>

    <div className="mealPlannerControls">
      <label className="mealServings"><UsersRound size={16}/><span>Человек</span><select value={servings} onChange={event => setServings(Number(event.target.value))}>{[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
      <button className="mealAutoButton" type="button" onClick={generateWeek}><WandSparkles size={16}/> Составить меню</button>
    </div>

    <div className="mealWeekProgress" aria-label={'Заполнено ' + completion + '% недели'}>
      <div><span>План на неделю</span><strong>{plannedCount} из 21 приёмов пищи</strong></div>
      <div className="mealProgressTrack"><span style={{ width: completion + '%' }}/></div>
    </div>

    <div className="mealWeekGrid">
      {days.map((day, dayIndex) => (
        <article className="mealDayCard" key={day}>
          <div className="mealDayHeading"><span className="mealDayNumber">{String(dayIndex + 1).padStart(2, '0')}</span><strong>{day}</strong><span className="mealDayDone">{slots.filter(slot => plan[day + '|' + slot.id] && recipes.some(recipe => String(recipe.id) === String(plan[day + '|' + slot.id]))).length}/3</span></div>
          <div className="mealDaySlots">
            {slots.map(slot => (
              <label className="mealSlot" key={slot.id}>
                <span>{slot.label}</span>
                <select value={plan[day + '|' + slot.id] || ''} onChange={event => setMeal(day, slot.id, event.target.value)}>
                  <option value="">Выбрать блюдо…</option>
                  {recipes.map(recipe => <option key={recipe.id} value={recipe.id}>{recipe.name}</option>)}
                </select>
              </label>
            ))}
          </div>
        </article>
      ))}
    </div>

    <div className="mealPlanInsight">
      <div className="mealInsightIcon"><ShoppingBasket size={18}/></div>
      <div><strong>Список покупок на всю неделю</strong><p>{shoppingCount ? shoppingCount + ' ингредиентов не хватает дома. Повторяющиеся продукты объединены, количество пересчитано на ' + servings + (servings === 1 ? ' человека.' : servings < 5 ? ' человек.' : ' человек.') : 'Добавьте блюда в меню — Food проверит запасы и рассчитает, что нужно купить.'}</p></div>
    </div>
    {missing.length > 0 && <div className="mealMissingPreview">{missing.slice(0, 6).map(item => <span key={item.name + item.unit}>{item.name}{item.hasQuantity ? ' · ' + quantityText(item.amount, item.unit) : ''}</span>)}{missing.length > 6 && <span>+ ещё {missing.length - 6}</span>}</div>}
    <button className="kitchenPlanAction" type="button" onClick={addMissing} disabled={!missing.length}><ShoppingBasket size={16}/>{missing.length ? 'Добавить недостающее в покупки' : 'Сначала добавьте блюда в меню'}</button>
    {notice && <p className="mealPlannerNotice" role="status"><Check size={15}/>{notice}</p>}
    <div className="mealPlannerFoot"><RefreshCw size={13}/> Автоподбор учитывает запасы, тип приёма пищи и старается не повторять блюда. Меню можно редактировать вручную.</div>
  </section>
}
