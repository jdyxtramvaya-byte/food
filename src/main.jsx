import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ChefHat, ChevronLeft, Minus, Plus, Search, UtensilsCrossed } from 'lucide-react'
import './styles.css'

const recipes = [
  {
    id: 'borscht',
    name: 'Борщ',
    category: 'Первые блюда',
    emoji: '🍲',
    baseServings: 4,
    description: 'Домашний насыщенный борщ',
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

function App() {
  const [selectedId, setSelectedId] = useState('borscht')
  const [servings, setServings] = useState(5)
  const [category, setCategory] = useState('Все')
  const [query, setQuery] = useState('')

  const selected = recipes.find(r => r.id === selectedId) || recipes[0]

  const filtered = useMemo(() => recipes.filter(r =>
    (category === 'Все' || r.category === category) &&
    r.name.toLowerCase().includes(query.toLowerCase())
  ), [category, query])

  const multiplier = servings / selected.baseServings

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <div className="brandIcon"><ChefHat size={24} /></div>
          <div>
            <h1>Food</h1>
            <p>Домашние калькуляционные карты</p>
          </div>
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">КАЛЬКУЛЯТОР БЛЮД</span>
          <h2>Готовим точно столько, сколько нужно.</h2>
          <p>Выберите блюдо и количество человек — Food автоматически пересчитает все ингредиенты.</p>
        </div>
      </section>

      <div className="workspace">
        <aside className="sidebar">
          <div className="search">
            <Search size={18} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Найти блюдо..." />
          </div>
          <div className="categories">
            {categories.map(item => (
              <button key={item} className={category === item ? 'category active' : 'category'} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="recipeList">
            {filtered.map(recipe => (
              <button key={recipe.id} className={selected.id === recipe.id ? 'recipe active' : 'recipe'} onClick={() => setSelectedId(recipe.id)}>
                <span className="recipeEmoji">{recipe.emoji}</span>
                <span>
                  <strong>{recipe.name}</strong>
                  <small>{recipe.category}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="card">
          <div className="dishHead">
            <div className="dishIcon">{selected.emoji}</div>
            <div>
              <span className="muted">{selected.category}</span>
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>
            </div>
          </div>

          <div className="servings">
            <div>
              <span className="muted">Количество человек</span>
              <strong>{servings} {servings === 1 ? 'человек' : 'человек'}</strong>
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

          <div className="note">
            <UtensilsCrossed size={18} />
            <span>Количество рассчитано пропорционально базовой рецептуре на {selected.baseServings} человека.</span>
          </div>
        </section>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
