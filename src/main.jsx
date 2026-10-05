import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ChefHat, Heart, Home, Minus, Plus, Search, UtensilsCrossed, X, Sparkles, Clock3 } from 'lucide-react'
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
  },

  {
    id: 'solyanka', name: 'Солянка', category: 'Первые блюда', emoji: '🍜', baseServings: 4,
    description: 'Густая мясная солянка с насыщенным вкусом',
    steps: ['Сварить мясной бульон.', 'Обжарить лук и добавить томатную пасту.', 'Нарезать мясные продукты и огурцы.', 'Соединить всё с бульоном и варить 15 минут.', 'Добавить маслины, зелень и дать настояться.'],
    ingredients: [['Говядина',400,'г'],['Копчёности',300,'г'],['Колбаса',200,'г'],['Лук',150,'г'],['Солёные огурцы',200,'г'],['Томатная паста',60,'г'],['Маслины',100,'г'],['Вода или бульон',1800,'мл'],['Масло',30,'мл']]
  },
  {
    id: 'chicken-potato', name: 'Курица с картофелем', category: 'Вторые блюда', emoji: '🍗', baseServings: 4,
    description: 'Запечённая курица с румяным картофелем',
    steps: ['Нарезать картофель крупными кусочками.', 'Натереть курицу специями и маслом.', 'Смешать всё в форме.', 'Запекать до румяной корочки.'],
    ingredients: [['Куриные бёдра',800,'г'],['Картофель',800,'г'],['Лук',150,'г'],['Растительное масло',40,'мл'],['Паприка',6,'г'],['Чеснок',3,'зубчика'],['Соль',10,'г']]
  },
  {
    id: 'pasta', name: 'Паста с курицей', category: 'Вторые блюда', emoji: '🍝', baseServings: 4,
    description: 'Сливочная паста с курицей',
    steps: ['Отварить пасту до состояния al dente.', 'Обжарить курицу до готовности.', 'Добавить сливки и сыр.', 'Соединить соус с пастой и прогреть.'],
    ingredients: [['Паста',400,'г'],['Куриное филе',500,'г'],['Сливки 20%',300,'мл'],['Сыр',120,'г'],['Лук',100,'г'],['Масло',30,'г'],['Соль',8,'г']]
  },
  {
    id: 'pilaf', name: 'Плов', category: 'Вторые блюда', emoji: '🍚', baseServings: 5,
    description: 'Рассыпчатый плов с мясом и морковью',
    steps: ['Обжарить мясо до корочки.', 'Добавить лук и морковь.', 'Залить водой и приготовить зирвак.', 'Засыпать рис и довести до готовности под крышкой.'],
    ingredients: [['Рис',500,'г'],['Мясо',600,'г'],['Морковь',350,'г'],['Лук',200,'г'],['Масло',80,'мл'],['Чеснок',1,'головка'],['Вода',750,'мл'],['Зира',5,'г']]
  },
  {
    id: 'greek-salad', name: 'Греческий салат', category: 'Салаты', emoji: '🥒', baseServings: 4,
    description: 'Свежий салат с овощами и фетой',
    steps: ['Нарезать овощи крупными кусочками.', 'Добавить фету и маслины.', 'Заправить оливковым маслом.', 'Посолить и аккуратно перемешать.'],
    ingredients: [['Помидоры',400,'г'],['Огурцы',300,'г'],['Болгарский перец',150,'г'],['Фета',200,'г'],['Маслины',100,'г'],['Красный лук',80,'г'],['Оливковое масло',40,'мл']]
  },
  {
    id: 'caesar', name: 'Цезарь с курицей', category: 'Салаты', emoji: '🥬', baseServings: 4,
    description: 'Хрустящий салат с курицей и соусом',
    steps: ['Обжарить куриное филе.', 'Подготовить салат и сухарики.', 'Смешать ингредиенты с соусом.', 'Посыпать пармезаном.'],
    ingredients: [['Куриное филе',400,'г'],['Салат ромэн',300,'г'],['Пармезан',80,'г'],['Сухарики',120,'г'],['Соус Цезарь',160,'г'],['Помидоры черри',200,'г']]
  },
  {
    id: 'syrniki', name: 'Сырники', category: 'Завтраки', emoji: '🧀', baseServings: 4,
    description: 'Нежные сырники с золотистой корочкой',
    steps: ['Смешать творог, яйцо, сахар и муку.', 'Сформировать небольшие сырники.', 'Обвалять в муке.', 'Обжарить с двух сторон до золотистой корочки.'],
    ingredients: [['Творог',500,'г'],['Яйца',2,'шт.'],['Мука',80,'г'],['Сахар',50,'г'],['Масло',30,'мл'],['Ванильный сахар',8,'г']]
  },
  {
    id: 'omelette', name: 'Омлет', category: 'Завтраки', emoji: '🍳', baseServings: 2,
    description: 'Пышный домашний омлет',
    steps: ['Взбить яйца с молоком и солью.', 'Разогреть сковороду с маслом.', 'Вылить смесь и готовить под крышкой.', 'Добавить зелень перед подачей.'],
    ingredients: [['Яйца',4,'шт.'],['Молоко',120,'мл'],['Масло',15,'г'],['Соль',3,'г'],['Зелень',10,'г']]
  },
  {
    id: 'mashed-potato', name: 'Картофельное пюре', category: 'Гарниры', emoji: '🥔', baseServings: 4,
    description: 'Нежное сливочное картофельное пюре',
    steps: ['Очистить и отварить картофель.', 'Слить воду и размять картофель.', 'Добавить горячее молоко и масло.', 'Перемешать до однородности.'],
    ingredients: [['Картофель',800,'г'],['Молоко',200,'мл'],['Сливочное масло',60,'г'],['Соль',8,'г']]
  },
  {
    id: 'buckwheat', name: 'Гречка', category: 'Гарниры', emoji: '🌾', baseServings: 4,
    description: 'Рассыпчатая гречка на каждый день',
    steps: ['Промыть крупу.', 'Залить водой в пропорции 1:2.', 'Посолить и довести до кипения.', 'Варить под крышкой до готовности.'],
    ingredients: [['Гречка',300,'г'],['Вода',600,'мл'],['Сливочное масло',40,'г'],['Соль',6,'г']]
  },
  {
    id: 'pizza', name: 'Домашняя пицца', category: 'Выпечка', emoji: '🍕', baseServings: 4,
    description: 'Тонкая пицца с сыром и ветчиной',
    steps: ['Замесить тесто и дать ему подойти.', 'Раскатать основу.', 'Добавить соус, начинку и сыр.', 'Выпекать в максимально горячей духовке.'],
    ingredients: [['Мука',300,'г'],['Вода',180,'мл'],['Дрожжи',7,'г'],['Томатный соус',120,'г'],['Моцарелла',250,'г'],['Ветчина',180,'г'],['Масло',20,'мл']]
  },
  {
    id: 'apple-pie', name: 'Яблочный пирог', category: 'Выпечка', emoji: '🥧', baseServings: 6,
    description: 'Мягкий домашний пирог с яблоками',
    steps: ['Взбить яйца с сахаром.', 'Добавить муку и разрыхлитель.', 'Нарезать яблоки и выложить в форму.', 'Залить тестом и выпекать до готовности.'],
    ingredients: [['Яблоки',500,'г'],['Мука',200,'г'],['Яйца',3,'шт.'],['Сахар',150,'г'],['Сливочное масло',100,'г'],['Разрыхлитель',8,'г']]
  },
  {
    id: 'charlotte', name: 'Шарлотка', category: 'Десерты', emoji: '🍎', baseServings: 6,
    description: 'Воздушная шарлотка с яблоками',
    steps: ['Взбить яйца с сахаром.', 'Аккуратно вмешать муку.', 'Выложить яблоки в форму.', 'Залить тестом и выпекать до золотистой корочки.'],
    ingredients: [['Яблоки',500,'г'],['Яйца',4,'шт.'],['Мука',160,'г'],['Сахар',150,'г'],['Разрыхлитель',5,'г']]
  },
  {
    id: 'pasta-carbonara', name: 'Карбонара', category: 'Вторые блюда', emoji: '🍝', baseServings: 2,
    description: 'Паста с беконом, яйцом и сыром',
    steps: ['Отварить спагетти.', 'Обжарить бекон.', 'Смешать яйца с сыром.', 'Соединить горячую пасту с беконом и яичной смесью.'],
    ingredients: [['Спагетти',200,'г'],['Бекон',120,'г'],['Яйца',2,'шт.'],['Пармезан',70,'г'],['Чёрный перец',3,'г']]
  }
]

const categories = ['Все', 'Первые блюда', 'Вторые блюда', 'Салаты', 'Завтраки', 'Гарниры', 'Выпечка', 'Десерты']

function readFavorites() {
  try {
    if (typeof window === 'undefined') return []
    const saved = JSON.parse(window.localStorage.getItem('food-favorites') || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function writeFavorites(value) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('food-favorites', JSON.stringify(value))
    }
  } catch {
    // Storage can be unavailable in private/restricted browser modes.
  }
}

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

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Food app error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="errorScreen">
          <div className="errorCard">
            <div className="errorIcon">🍲</div>
            <h1>Food не удалось запустить</h1>
            <p>Попробуйте обновить страницу. Если ошибка повторится, очистите данные сайта.</p>
            <button onClick={() => window.location.reload()}>Обновить</button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

function App() {
  const [selectedId, setSelectedId] = useState('borscht')
  const [servings, setServings] = useState(5)
  const [category, setCategory] = useState('Все')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState(readFavorites)
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

  const saveFavorites = (next) => { setFavorites(next); writeFavorites(next) }

  const toggleFavorite = (id) => {
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]
    saveFavorites(next)
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
          <span className="eyebrow"><Sparkles size={13}/> ДОМАШНЯЯ КУХНЯ</span>
          <h2>Готовим точно столько, сколько нужно.</h2>
          <p>Рецепты, точные пропорции и понятные шаги. Выберите блюдо — остальное Food посчитает сам.</p>
        </div>
      </section>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebarTitle"><span className="libraryLabel">Моя кухня</span>
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
              <div className="dishIcon"><span>{selected.emoji}</span><i></i></div>
              <div>
                <span className="muted">{selected.category} · {selected.ingredients.length} ингредиентов</span>
                <h3>{selected.name}</h3>
                <p>{selected.description}</p>
              </div>
            </div>
            <button className={favorites.includes(selected.id) ? 'favoriteButton active' : 'favoriteButton'} onClick={() => toggleFavorite(selected.id)} aria-label="Добавить в избранное">
              <Heart size={19} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="recipeMeta"><span><Clock3 size={15}/> 30–60 мин</span><span><UtensilsCrossed size={15}/> {selected.baseServings} {pluralPeople(selected.baseServings)}</span></div>

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

          <div className="sectionHeading"><div><span>Ингредиенты</span><small>Количество автоматически пересчитано</small></div><b>{selected.ingredients.length}</b></div>

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

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  )
}
