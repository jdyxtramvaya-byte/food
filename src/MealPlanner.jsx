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

  const [selectedDay, setSelectedDay] = useState(0)
  const getRecipe = (day, slot) => recipes.find(recipe => String(recipe.id) === String(plan[day + '|' + slot]))
  const dayCount = day => slots.filter(slot => getRecipe(day, slot.id)).length

  return <section className="kitchenSection mealPlannerPro">
    <div className="mealPlannerHero">
      <div className="mealHeroGlow"/>
      <div className="mealHeroTop"><span className="mealHeroTag"><CalendarDays size={13}/> ВАШ РИТМ ПИТАНИЯ</span><span className="mealHeroCount">{plannedCount}<small>/21</small></span></div>
      <h3>Вкусная неделя.<br/><em>Без лишних забот.</em></h3>
      <p>Соберите меню, а Food рассчитает продукты для всей семьи.</p>
      <div className="mealHeroBottom">
        <label className="mealServings mealHeroServings"><UsersRound size={15}/><span>На</span><select value={servings} onChange={event => setServings(Number(event.target.value))}>{[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}</option>)}</select><span>{servings === 1 ? 'человека' : servings < 5 ? 'человека' : 'человек'}</span></label>
        <button className="mealAutoButton" type="button" onClick={generateWeek}><WandSparkles size={16}/> Собрать меню</button>
      </div>
      <div className="mealHeroProgress"><span style={{width:completion+'%'}}/></div>
    </div>

    <div className="mealWeekHeading"><div><span>ВАША НЕДЕЛЯ</span><h4>План питания</h4></div><div className="mealWeekStatus"><span className="mealStatusDot"/>{plannedCount === 21 ? 'Всё запланировано' : plannedCount ? 'Можно продолжать' : 'Начнём планировать'}</div></div>
    <div className="mealDayRail" role="tablist" aria-label="Дни недели">
      {days.map((day,index) => <button key={day} type="button" role="tab" aria-selected={selectedDay===index} className={selectedDay===index?'mealDayTab active':'mealDayTab'} onClick={()=>setSelectedDay(index)}><span>{['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'][index]}</span><strong>{dayCount(day)}</strong></button>)}
    </div>

    <div className="mealWeekGrid">
      {days.map((day, dayIndex) => (
        <article className={selectedDay===dayIndex?'mealDayCard active':'mealDayCard'} key={day}>
          <div className="mealDayHeading"><div><span className="mealDayKicker">ДЕНЬ {String(dayIndex+1).padStart(2,'0')}</span><strong>{day}</strong></div><span className={dayCount(day)===3?'mealDayDone complete':'mealDayDone'}>{dayCount(day)===3?<Check size={12}/>:dayCount(day)+' / 3'}</span></div>
          <div className="mealDaySlots">
            {slots.map(slot => {
              const recipe=getRecipe(day,slot.id)
              return <div className={recipe?'mealSlot mealSlotFilled':'mealSlot'} key={slot.id}>
                <div className="mealSlotPhoto">
                  {recipe?.image ? <img src={recipe.image} alt="" loading="lazy"/> : <div className="mealSlotPlaceholder"><span>{slot.id==='breakfast'?'☀':slot.id==='lunch'?'◒':'☾'}</span></div>}
                  <span className="mealSlotLabel">{slot.label}</span>
                  {recipe && <span className="mealSlotTime"><Check size={11}/></span>}
                </div>
                <div className="mealSlotInfo">
                  <strong>{recipe?.name || 'Что приготовим?'}</strong>
                  <select aria-label={slot.label+' · '+day} value={plan[day+'|'+slot.id]||''} onChange={event=>setMeal(day,slot.id,event.target.value)}>
                    <option value="">Выбрать блюдо</option>
                    {recipes.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </div>
              </div>
            })}
          </div>
          {dayCount(day)===3 && <div className="mealDayFooter"><Check size={13}/> День спланирован</div>}
        </article>
      ))}
    </div>

    <div className="mealShoppingCard">
      <div className="mealShoppingTop">
        <div className="mealShoppingIcon"><ShoppingBasket size={21}/></div>
        <div className="mealShoppingCopy"><span>УМНЫЙ СПИСОК</span><h4>Что купить</h4><p>{shoppingCount ? 'Food нашёл '+shoppingCount+' ингредиентов, которых нет в ваших запасах.' : 'Добавьте блюда в меню — соберём список недостающих продуктов.'}</p></div>
        <div className="mealShoppingTotal"><strong>{shoppingCount}</strong><span>позиций</span></div>
      </div>
      {missing.length>0 && <div className="mealShoppingIngredients">{missing.slice(0,8).map(item=><div key={item.name+'|'+item.unit}><span className="mealIngredientDot"/><span className="mealIngredientName">{item.name}</span><strong>{item.hasQuantity?quantityText(item.amount,item.unit):'по вкусу'}</strong></div>)}{missing.length>8&&<span className="mealMoreIngredients">и ещё {missing.length-8} позиций</span>}</div>}
      <button className="kitchenPlanAction mealShoppingAction" type="button" onClick={addMissing} disabled={!missing.length}><ShoppingBasket size={16}/>{missing.length?'Добавить в общий список покупок':'Список пока пуст'}</button>
    </div>
    {notice && <p className="mealPlannerNotice" role="status"><Check size={15}/>{notice}</p>}
    <div className="mealPlannerFoot"><RefreshCw size={13}/> Автоподбор учитывает продукты дома. Вы можете заменить любое блюдо — меню сохранится на этом устройстве.</div>
  </section>
}
