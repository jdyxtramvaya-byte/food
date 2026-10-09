import React, { useEffect, useMemo, useState } from 'react'
import MealPlanner from './MealPlanner'
import AIChef from './AIChef'
import { UserRound, Heart, Refrigerator, ShoppingBasket, ChefHat, Check, Plus, Trash2, Clock3, Sparkles, ArrowUpRight } from 'lucide-react'

const readJSON = (key, fallback) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback))
    return value ?? fallback
  } catch { return fallback }
}
const writeJSON = (key, value) => {
  try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {}
}
const readProfile = () => {
  try { const value = JSON.parse(window.localStorage.getItem('food-kitchen-profile') || '{"name":""}'); return value && typeof value === 'object' ? value : { name: '' } } catch { return { name: '' } }
}

export default function MyKitchen({ recipes, favorites, onSelectRecipe, onOpenFinder }) {
  const [profile, setProfile] = useState(readProfile)
  const [pantry, setPantry] = useState(() => {
    try { return window.localStorage.getItem('food-pantry-ingredients') || '' } catch { return '' }
  })
  const [shopping, setShopping] = useState(() => readJSON('food-shopping-list', []))
  const [taste, setTaste] = useState(() => readJSON('food-taste-memory', {}))
  const [history, setHistory] = useState(() => readJSON('food-cooking-history', []))
  const [newItem, setNewItem] = useState('')

  useEffect(() => { writeJSON('food-kitchen-profile', profile) }, [profile])
  useEffect(() => { try { window.localStorage.setItem('food-pantry-ingredients', pantry) } catch {} }, [pantry])
  useEffect(() => { writeJSON('food-shopping-list', shopping) }, [shopping])
  useEffect(() => { writeJSON('food-taste-memory', taste) }, [taste])

  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id))
  const pantryItems = useMemo(() => pantry.split(/[,;\n]+/).map(item => item.trim()).filter(Boolean), [pantry])
  const ratedRecipes = recipes.filter(recipe => taste && taste[recipe.id])
  const recipeById = id => recipes.find(recipe => recipe.id === id)

  const addShoppingItem = event => {
    event?.preventDefault()
    const name = newItem.trim()
    if (!name) return
    setShopping(current => current.some(item => item.name.toLowerCase() === name.toLowerCase()) ? current : [...current, { name, checked: false }])
    setNewItem('')
  }

  return (
    <section className="kitchenPage">
      <div className="kitchenWelcome">
        <div className="kitchenWelcomeCopy">
          <span className="kitchenEyebrow"><Sparkles size={13}/> ВАША КУХНЯ · FOOD</span>
          <h2>{profile.name.trim() ? 'Всё под контролем, ' + profile.name.trim() : 'Ваша кухня — в одном месте'}</h2>
          <p>Продукты, покупки, любимые блюда и ваш кулинарный прогресс. Данные сохраняются на этом устройстве.</p>
        </div>
        <div className="kitchenAvatar"><UserRound size={27}/></div>
      </div>

      <div className="kitchenProfileCard">
        <label htmlFor="kitchen-name">Как к вам обращаться?</label>
        <input id="kitchen-name" value={profile.name || ''} maxLength={36} onChange={event => setProfile(current => ({ ...current, name: event.target.value }))} placeholder="Ваше имя"/>
        <span>Имя и настройки хранятся только в браузере этого устройства.</span>
      </div>

      <div className="kitchenStats">
        <div><span className="kitchenStatIcon"><Heart size={17}/></span><strong>{favoriteRecipes.length}</strong><small>любимых блюд</small></div>
        <div><span className="kitchenStatIcon"><Refrigerator size={17}/></span><strong>{pantryItems.length}</strong><small>продуктов дома</small></div>
        <div><span className="kitchenStatIcon"><ShoppingBasket size={17}/></span><strong>{shopping.filter(item => !item.checked).length}</strong><small>покупок осталось</small></div>
      </div>

      <div className="kitchenSection">
        <div className="kitchenSectionHead"><div><span>01 · ЗАПАСЫ</span><h3><Refrigerator size={19}/> Что есть дома</h3></div><button onClick={onOpenFinder}>Подобрать блюдо <ArrowUpRight size={15}/></button></div>
        <p className="kitchenSectionDesc">Перечислите продукты через запятую. Food использует этот список в подборе блюд.</p>
        <textarea value={pantry} onChange={event => setPantry(event.target.value)} placeholder="Например: картофель, яйца, молоко, сыр" rows={3}/>
        <div className="kitchenChips">{pantryItems.slice(0,12).map((item,index) => <span key={item + index}>{item}</span>)}</div>
      </div>

      <AIChef pantry={pantry} recipes={recipes} />
      <MealPlanner recipes={recipes} pantry={pantry} shopping={shopping} setShopping={setShopping} />

      <div className="kitchenSection">
        <div className="kitchenSectionHead"><div><span>02 · СПИСОК</span><h3><ShoppingBasket size={19}/> Список покупок</h3></div><span className="kitchenCount">{shopping.length}</span></div>
        <form className="kitchenAddForm" onSubmit={addShoppingItem}><input value={newItem} onChange={event => setNewItem(event.target.value)} placeholder="Добавить продукт…"/><button type="submit" aria-label="Добавить продукт"><Plus size={18}/></button></form>
        {shopping.length ? <div className="kitchenShoppingItems">{shopping.map((item,index) => <div className={item.checked ? 'kitchenShoppingItem checked' : 'kitchenShoppingItem'} key={item.name + index}><button className="kitchenCheck" onClick={() => setShopping(current => current.map((row,i) => i === index ? { ...row, checked: !row.checked } : row))} aria-label={item.checked ? 'Вернуть в список' : 'Отметить купленным'}>{item.checked && <Check size={14}/>}</button><span>{item.name}</span><button className="kitchenRemove" onClick={() => setShopping(current => current.filter((_,i) => i !== index))} aria-label="Удалить"><Trash2 size={15}/></button></div>)}<button className="kitchenTextAction" onClick={() => setShopping(current => current.filter(item => !item.checked))}>Убрать купленные</button></div> : <div className="kitchenEmpty">Список пуст. Добавьте продукты или недостающие ингредиенты из подборщика.</div>}
      </div>

      <div className="kitchenSection">
        <div className="kitchenSectionHead"><div><span>03 · ИЗБРАННОЕ</span><h3><Heart size={19}/> Любимые рецепты</h3></div><span className="kitchenCount">{favoriteRecipes.length}</span></div>
        {favoriteRecipes.length ? <div className="kitchenRecipeGrid">{favoriteRecipes.slice(0,6).map(recipe => <button className="kitchenRecipe" key={recipe.id} onClick={() => onSelectRecipe(recipe.id)}><img src={recipe.image} alt="" loading="lazy"/><span><strong>{recipe.name}</strong><small>{recipe.category}</small></span><ArrowUpRight size={15}/></button>)}</div> : <div className="kitchenEmpty">Сохраняйте блюда сердечком — они появятся здесь.</div>}
      </div>

      <div className="kitchenSection">
        <div className="kitchenSectionHead"><div><span>04 · ВАШ ВКУС</span><h3><Sparkles size={19}/> Персональные предпочтения</h3></div><span className="kitchenCount">{ratedRecipes.length}</span></div>
        {ratedRecipes.length ? <div className="kitchenTasteList">{ratedRecipes.map(recipe => <div key={recipe.id}><span>{recipe.name}</span><strong className={taste[recipe.id] === 'love' ? 'liked' : 'disliked'}>{taste[recipe.id] === 'love' ? 'Нравится' : 'Не моё'}</strong></div>)}</div> : <div className="kitchenEmpty">Отмечайте в подборщике, какие блюда вам нравятся. Food сохранит ваши оценки на этом устройстве.</div>}
      </div>

      <div className="kitchenSection">
        <div className="kitchenSectionHead"><div><span>05 · ПРОГРЕСС</span><h3><Clock3 size={19}/> История готовки</h3></div><span className="kitchenCount">{history.length}</span></div>
        {history.length ? <div className="kitchenHistory">{history.slice(0,8).map((entry,index) => { const recipe = recipeById(entry.id); return <div key={entry.id + index}><span className="kitchenHistoryIcon"><ChefHat size={17}/></span><span><strong>{entry.name || recipe?.name || 'Блюдо'}</strong><small>{entry.date ? new Date(entry.date).toLocaleDateString('ru-RU') : 'Приготовлено'}</small></span><Check size={16}/></div> })}</div> : <div className="kitchenEmpty">Когда завершите все шаги рецепта, блюдо появится в истории.</div>}
      </div>
      <p className="kitchenPrivacy">Локальный профиль · без регистрации · без передачи данных на сервер</p>
    </section>
  )
}
