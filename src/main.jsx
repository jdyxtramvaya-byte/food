import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ChefHat, Heart, Home, Minus, Plus, Search, UtensilsCrossed, X } from 'lucide-react'
import './styles.css'

const recipes = [
  {
    id: 'borscht',
    name: 'Борщ',
    category: 'Первые блюда',
    emoji: '🍲',
    baseServings: 4,
    description: 'Домашний насыщенный борщ',
    steps: ['Сварить мясо до готовности.', 'Добавить картофель и капусту.', 'Приготовить зажарку из свёклы, моркови и лука.', 'Соединить всё в кастрюле и довести до готовности.', 'Добавить чеснок, соль и дать борщу настояться.'],
    ingredients: [
      ['Свинина или говядина', 500, 'г'],
      ['Картофель', 500, 'г'],
      ['Капуста', 400, 'г'],
      ['Свёкла', 250, 'г'],
      ['Морковь', 150, 'г'],
      ['Лук репчатый', 150, 'г'],
      ['Томатная паста', 70, 'г'],
      ['Растительное масло', 40, 'мл'],
      ['Вода или бульон', 2000, 'мл'],
      ['Чеснок', 2, 'зубчика'],
      ['Соль', 12, 'г']
    ]
  },
  {
    id: 'cutlets',
    name: 'Домашние котлеты',
    category: 'Вторые блюда',
    emoji: '🍖',
    baseServings: 4,
    description: 'Сочные котлеты из фарша',
    steps: ['Замочить хлеб в молоке.', 'Смешать фарш с луком, яйцом и хлебом.', 'Добавить соль и перец, хорошо вымесить.', 'Сформировать котлеты и обвалять в сухарях.', 'Обжарить до румяной корочки и довести до готовности.'],
    ingredients: [
      ['Мясной фарш', 600, 'г'],
      ['Лук репчатый', 150, 'г'],
      ['Белый хлеб', 120, 'г'],
      ['Молоко', 150, 'мл'],
      ['Яйцо', 1, 'шт.'],
      ['Панировочные сухари', 80, 'г'],
      ['Растительное масло', 50, 'мл'],
      ['Соль', 10, 'г'],
      ['Чёрный перец', 2, 'г']
    ]
  },
  {
    id: 'olivier',
    name: 'Оливье',
    category: 'Салаты',
    emoji: '🥗',
    baseServings: 4,
    description: 'Классический домашний салат',
    steps: ['Отварить картофель, морковь и яйца.', 'Нарезать ингредиенты небольшими кубиками.', 'Добавить огурцы, горошек и лук.', 'Заправить майонезом и аккуратно перемешать.', 'Посолить по вкусу.'],
    ingredients: [
      ['Картофель', 400, 'г'],
      ['Морковь', 150, 'г'],
      ['Яйца', 4, 'шт.'],
      ['Докторская колбаса', 300, 'г'],
      ['Солёные огурцы', 200, 'г'],
      ['Зелёный горошек', 200, 'г'],
      ['Майонез', 180, 'г'],
      ['Лук', 80, 'г'],
      ['Соль', 5, 'г']
    ]
  },
  {
    id: 'pancakes',
    name: 'Блины',
    category: 'Завтраки',
    emoji: '🥞',
    baseServings: 4,
    description: 'Тонкие домашние блины',
    steps: ['Взбить яйца с сахаром и солью.', 'Добавить молоко и муку, перемешать до однородности.', 'Влить масло и дать тесту постоять 10 минут.', 'Выпекать тонкие блины на хорошо разогретой сковороде.'],
    ingredients: [
      ['Молоко', 500, 'мл'],
      ['Мука', 250, 'г'],
      ['Яйца', 3, 'шт.'],
      ['Сахар', 30, 'г'],
      ['Растительное масло', 30, 'мл'],
      ['Соль', 3, 'г']
    ]
  }
]

const categories = ['Все', 'Первые блюда', 'Вторые блюда', 'Салаты', 'Завтраки']

function formatAmount(value, unit) {
  const rounded = Math.round(value * 10) / 10
  if (unit === 'г' && rounded >= 1000) return `${Math.round(rounded / 100 * 10) / 10} кг`
  if (unit === 'мл' && rounded >= 1000) return `${Math.round(rounded / 100 * 10) / 10} л`
  return String(rounded).replace('.0', '') + ' ' + unit
}

function pluralPeople(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'человек'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'человека'
  return 'человек'
}

function App() {
  const [selectedId, setSelectedId] = useState('borscht')
  const [servings, setServings] = useState(5)
  const [category, setCategory] = useState('Все')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState([])
  const [tab, setTab] = useState('dishes')
  const [showSteps, setShowSteps] = useState(false)

  const selected = recipes.find(r => r.id === selectedId) || recipes[0]

  const filtered = useMemo(() => recipes.filter(r => {
    const matchesCategory = category === 'Все' || r.category === category
    const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase())
    const matchesTab = tab !== 'favorites' || favorites.includes(r.id)
    return matchesCategory && matchesQuery && matchesTab
  }), [category, query, tab, favorites])

  const multiplier = servings / selected.baseServings

  const toggleFavorite = (id) => {
    setFavorites(current => current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id]
    )
  }

  const selectRecipe = (id) => {
    setSelectedId(id)
    setShowSteps(false)
    setTab('dishes')
  }

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <div className="brandIcon"><ChefHat size={22} /></div>
          <div>
            <h1>Food</h1>
            <p>Калькулятор домашних блюд</p>
          </div>
        </div>
        <div className="headerMeta">Домашняя кухня</div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">КАЛЬКУЛЯТОР БЛЮД</span>
          <h2>Готовим точно столько, сколько нужно.</h2>
          <p>Выберите блюдо и количество человек — Food автоматически пересчитает ингредиенты.</p>
        </div>
      </section>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebarTitle">
            <span>Блюда</span>
            <span className="count">{filtered.length}</span>
          </div>
          <div className="search">
            <Search size={18} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Найти блюдо..." />
            {query && <button className="clearSearch" onClick={() => setQuery('')} aria-label="Очистить"><X size={15}/></button>}
          </div>
          <div className="categories">
            {categories.map(item => (
              <button key={item} className={category === item ? 'category active' : 'category'} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="recipeList">
            {filtered.length ? filtered.map(recipe => (
              <button key={recipe.id} className={selected.id === recipe.id ? 'recipe active' : 'recipe'} onClick={() => selectRecipe(recipe.id)}>
                <span className="recipeEmoji">{recipe.emoji}</span>
                <span className="recipeText">
                  <strong>{recipe.name}</strong>
                  <small>{recipe.category}</small>
                </span>
                <Heart className={favorites.includes(recipe.id) ? 'miniHeart liked' : 'miniHeart'} size={15} fill={favorites.includes(recipe.id) ? 'currentColor' : 'none'} />
              </button>
            )) : <div className="empty">В избранном пока нет блюд.</div>}
          </div>
        </aside>

        <section className="card">
          <div className="cardTop">
            <div className="dishHead">
              <div className="dishIcon">{selected.emoji}</div>
              <div>
                <span className="muted">{selected.category}</span>
                <h3>{selected.name}</h3>
                <p>{selected.description}</p>
              </div>
            </div>
            <button className={favorites.includes(selected.id) ? 'favoriteButton active' : 'favoriteButton'} onClick={() => toggleFavorite(selected.id)} aria-label="Добавить в избранное">
              <Heart size={19} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="servings">
            <div>
              <span className="muted">Количество</span>
              <strong>{servings} {pluralPeople(servings)}</strong>
            </div>
            <div className="stepper">
              <button onClick={() => setServings(Math.max(1, servings - 1))} aria-label="Уменьшить"><Minus size={18}/></button>
              <span>{servings}</span>
              <button onClick={() => setServings(Math.min(50, servings + 1))} aria-label="Увеличить"><Plus size={18}/></button>
            </div>
          </div>

          <div className="scaleButtons">
            {[2, 4, 5, 6, 10].map(n => (
              <button key={n} className={servings === n ? 'scale active' : 'scale'} onClick={() => setServings(n)}>{n}</button>
            ))}
          </div>

          <div className="tableHead">
            <span>ИНГРЕДИЕНТ</span>
            <span>КОЛИЧЕСТВО</span>
          </div>

          <div className="ingredients">
            {selected.ingredients.map(([name, amount, unit]) => (
              <div className="ingredient" key={name}>
                <span>{name}</span>
                <strong>{formatAmount(amount * multiplier, unit)}</strong>
              </div>
            ))}
          </div>

          <div className="cardActions">
            <button className={showSteps ? 'secondaryAction active' : 'secondaryAction'} onClick={() => setShowSteps(!showSteps)}>
              <UtensilsCrossed size={17} />
              {showSteps ? 'Скрыть приготовление' : 'Как приготовить'}
            </button>
          </div>

          {showSteps && (
            <div className="steps">
              <div className="stepsTitle">Приготовление</div>
              {selected.steps.map((step, index) => (
                <div className="step" key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          )}

          <div className="note">
            <UtensilsCrossed size={18} />
            <span>Расчёт выполнен по базовой рецептуре на {selected.baseServings} {pluralPeople(selected.baseServings)}.</span>
          </div>
        </section>
      </div>

      <nav className="bottomNav">
        <button className={tab === 'dishes' ? 'navItem active' : 'navItem'} onClick={() => setTab('dishes')}>
          <Home size={20} /><span>Блюда</span>
        </button>
        <button className={tab === 'favorites' ? 'navItem active' : 'navItem'} onClick={() => setTab('favorites')}>
          <Heart size={20} fill={tab === 'favorites' ? 'currentColor' : 'none'} /><span>Избранное</span>
        </button>
      </nav>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
