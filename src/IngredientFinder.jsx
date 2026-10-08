import React, { useMemo, useState } from 'react'
import { ChefHat, Search, X, Check, ShoppingCart, Globe, LoaderCircle, ArrowLeft, ExternalLink } from 'lucide-react'

const aliases = {
  'яйцо': ['яйца', 'яйцо'],
  'молоко': ['молоко'],
  'мука': ['мука'],
  'картофель': ['картофель', 'картошка'],
  'лук': ['лук', 'лук репчатый'],
  'масло': ['масло', 'растительное масло', 'сливочное масло'],
  'курица': ['куриное филе', 'куриные бёдра', 'курица'],
  'мясо': ['мясо', 'мясной фарш', 'говядина', 'свинина или говядина'],
  'сыр': ['сыр', 'пармезан', 'моцарелла', 'фета'],
  'сахар': ['сахар'],
  'вода': ['вода', 'вода или бульон'],
  'яблоки': ['яблоки'],
  'рис': ['рис'],
  'гречка': ['гречка'],
  'паста': ['паста', 'спагетти']
}

const apiIngredients = [
  { ru: ['курица', 'куриное филе', 'куриные бедра', 'куриные бёдра'], api: 'chicken_breast' },
  { ru: ['говядина', 'мясо', 'фарш'], api: 'beef' },
  { ru: ['свинина'], api: 'pork' },
  { ru: ['картофель', 'картошка'], api: 'potatoes' },
  { ru: ['лук', 'лук репчатый'], api: 'onion' },
  { ru: ['яйцо', 'яйца'], api: 'eggs' },
  { ru: ['молоко'], api: 'milk' },
  { ru: ['сыр', 'пармезан', 'моцарелла', 'фета'], api: 'cheddar_cheese' },
  { ru: ['рис'], api: 'rice' },
  { ru: ['паста', 'спагетти', 'макароны'], api: 'spaghetti' },
  { ru: ['помидор', 'помидоры', 'томат'], api: 'tomatoes' },
  { ru: ['морковь'], api: 'carrots' },
  { ru: ['чеснок'], api: 'garlic' },
  { ru: ['перец'], api: 'pepper' },
  { ru: ['лимон'], api: 'lemon' },
  { ru: ['лосось', 'рыба'], api: 'salmon' },
  { ru: ['яблоки', 'яблоко'], api: 'apples' },
  { ru: ['мука'], api: 'flour' }
]

const normalize = value => value
  .toLowerCase()
  .replace(/ё/g, 'е')
  .replace(/[^а-яa-z0-9]+/g, ' ')
  .trim()

const matches = (have, ingredient) => {
  const h = normalize(have)
  const i = normalize(ingredient)
  if (!h || !i) return false
  if (h.includes(i) || i.includes(h)) return true
  return Object.values(aliases).some(group =>
    group.some(item => normalize(item) === i) &&
    group.some(item => normalize(item) === h || h.includes(normalize(item)) || normalize(item).includes(h))
  )
}

const API = 'https://www.themealdb.com/api/json/v1/1'

function mealIngredients(meal) {
  return Array.from({ length: 20 }, (_, index) => {
    const ingredient = meal[`strIngredient${index + 1}`]?.trim()
    const measure = meal[`strMeasure${index + 1}`]?.trim()
    return ingredient ? `${ingredient}${measure ? ` — ${measure}` : ''}` : null
  }).filter(Boolean)
}

export default function IngredientFinder({ recipes, onClose, onSelectRecipe }) {
  const [value, setValue] = useState('')
  const [onlineMeals, setOnlineMeals] = useState([])
  const [onlineLoading, setOnlineLoading] = useState(false)
  const [onlineError, setOnlineError] = useState('')
  const [selectedOnlineMeal, setSelectedOnlineMeal] = useState(null)

  const available = useMemo(() => value
    .split(/[,;\n]+/)
    .map(item => item.trim())
    .filter(Boolean), [value])

  const results = useMemo(() => {
    if (!available.length) return []
    return recipes.map(recipe => {
      const ingredientNames = recipe.ingredients.map(item => item[0])
      const matched = ingredientNames.filter(name => available.some(have => matches(have, name)))
      const missing = ingredientNames.filter(name => !matched.includes(name))
      return {
        recipe,
        matched,
        missing,
        percent: Math.round((matched.length / ingredientNames.length) * 100)
      }
    }).filter(item => item.matched.length > 0)
      .sort((a, b) => b.percent - a.percent || a.missing.length - b.missing.length)
      .slice(0, 8)
  }, [available, recipes])

  const findOnlineRecipes = async () => {
    const selectedIngredient = available
      .map(have => apiIngredients.find(item => item.ru.some(alias => normalize(have).includes(normalize(alias)) || normalize(alias).includes(normalize(have)))))
      .find(Boolean)

    if (!selectedIngredient) {
      setOnlineError('Для онлайн-поиска укажи знакомый продукт: курицу, картофель, яйца, рис, пасту, помидоры или другой основной ингредиент.')
      setOnlineMeals([])
      return
    }

    setOnlineLoading(true)
    setOnlineError('')
    setSelectedOnlineMeal(null)
    try {
      const response = await fetch(`${API}/filter.php?i=${encodeURIComponent(selectedIngredient.api)}`)
      if (!response.ok) throw new Error('Не удалось связаться с базой рецептов.')
      const data = await response.json()
      const meals = (data.meals || []).slice(0, 8)
      const details = await Promise.all(meals.slice(0, 6).map(async meal => {
        const detailResponse = await fetch(`${API}/lookup.php?i=${encodeURIComponent(meal.idMeal)}`)
        if (!detailResponse.ok) return null
        const detailData = await detailResponse.json()
        return detailData.meals?.[0] || null
      }))
      setOnlineMeals(details.filter(Boolean))
      if (!details.some(Boolean)) setOnlineError('По этому продукту рецепты не нашлись. Попробуй другой ингредиент.')
    } catch {
      setOnlineError('Не получилось загрузить рецепты. Проверь подключение к интернету и попробуй ещё раз.')
      setOnlineMeals([])
    } finally {
      setOnlineLoading(false)
    }
  }

  return (
    <div className="finderOverlay" role="dialog" aria-modal="true" aria-label="Что приготовить из продуктов">
      <div className="finderCard">
        {selectedOnlineMeal ? (
          <>
            <div className="finderHeader">
              <div className="finderTitle">
                <button className="finderClose" onClick={() => setSelectedOnlineMeal(null)} aria-label="Назад"><ArrowLeft size={20}/></button>
                <div><span className="muted">THEMEALDB · РЕЦЕПТ</span><h3>{selectedOnlineMeal.strMeal}</h3></div>
              </div>
              <button className="finderClose" onClick={onClose} aria-label="Закрыть"><X size={20}/></button>
            </div>
            {selectedOnlineMeal.strMealThumb && <img className="finderOnlineHero" src={selectedOnlineMeal.strMealThumb} alt={selectedOnlineMeal.strMeal} />}
            <div className="finderOnlineSection">
              <h4>Ингредиенты</h4>
              <ul>{mealIngredients(selectedOnlineMeal).map((ingredient, index) => <li key={index}>{ingredient}</li>)}</ul>
            </div>
            <div className="finderOnlineSection">
              <h4>Приготовление</h4>
              <p className="finderOnlineInstructions">{(selectedOnlineMeal.strInstructions || 'Инструкция не указана.').replace(/\r/g, '').split('\n').map(s => s.trim()).filter(Boolean).join('\n\n')}</p>
            </div>
            <a className="finderSourceLink" href={selectedOnlineMeal.strSource || selectedOnlineMeal.strMealThumb} target="_blank" rel="noreferrer"><ExternalLink size={15}/> Открыть источник рецепта</a>
          </>
        ) : (
          <>
            <div className="finderHeader">
              <div className="finderTitle">
                <div className="finderIcon"><ChefHat size={22}/></div>
                <div><span className="muted">FOOD · УМНЫЙ ПОИСК</span><h3>Что приготовить?</h3></div>
              </div>
              <button className="finderClose" onClick={onClose} aria-label="Закрыть"><X size={20}/></button>
            </div>

            <p className="finderLead">Напишите продукты, которые есть дома. Food подберёт блюда из вашей коллекции и найдёт дополнительные рецепты в открытой базе.</p>

            <div className="finderInputWrap">
              <Search size={18}/>
              <textarea
                value={value}
                onChange={e => { setValue(e.target.value); setOnlineMeals([]); setOnlineError('') }}
                placeholder="Например: картофель, яйца, молоко, сыр"
                rows={3}
                autoFocus
              />
            </div>

            <div className="finderExamples">
              {['картофель, яйца, сыр', 'курица, картофель, лук', 'мука, молоко, яйца'].map(example => (
                <button key={example} onClick={() => { setValue(example); setOnlineMeals([]); setOnlineError('') }}>{example}</button>
              ))}
            </div>

            {available.length > 0 && (
              <div className="finderResults">
                <div className="finderResultsHead"><strong>Подходит вам</strong><span>{results.length} блюд</span></div>
                {results.length ? results.map(({ recipe, matched, missing, percent }) => (
                  <button className="finderResult" key={recipe.id} onClick={() => onSelectRecipe(recipe.id)}>
                    <img src={recipe.image} alt="" />
                    <span className="finderResultBody">
                      <strong>{recipe.name}</strong>
                      <small>{matched.length} из {recipe.ingredients.length} ингредиентов · {percent}% совпадения</small>
                      {missing.length ? (
                        <small className="finderMissing"><ShoppingCart size={13}/> Не хватает: {missing.slice(0, 3).join(', ')}{missing.length > 3 ? '…' : ''}</small>
                      ) : (
                        <small className="finderReady"><Check size={13}/> Можно приготовить из того, что есть</small>
                      )}
                    </span>
                  </button>
                )) : (
                  <div className="finderEmpty">В вашей коллекции пока нет совпадений. Попробуйте онлайн-поиск ниже.</div>
                )}
              </div>
            )}

            <div className="finderOnline">
              <div className="finderOnlineHeading">
                <span className="finderIcon"><Globe size={20}/></span>
                <div><strong>Ещё рецепты из интернета</strong><small>Открытая база TheMealDB</small></div>
              </div>
              <button className="finderOnlineButton" onClick={findOnlineRecipes} disabled={onlineLoading || !available.length}>
                {onlineLoading ? <><LoaderCircle size={17} className="finderSpinner"/> Ищем рецепты…</> : <><Search size={17}/> Найти дополнительные рецепты</>}
              </button>
              <p className="finderOnlineNote">Бесплатный API. Поиск выполняется по одному распознанному ингредиенту; рецепты и инструкции могут быть на английском языке.</p>
              {onlineError && <div className="finderEmpty" role="status">{onlineError}</div>}
              {onlineMeals.length > 0 && (
                <div className="finderOnlineResults">
                  <div className="finderResultsHead"><strong>Найдено в TheMealDB</strong><span>{onlineMeals.length}</span></div>
                  {onlineMeals.map(meal => (
                    <button className="finderResult" key={meal.idMeal} onClick={() => setSelectedOnlineMeal(meal)}>
                      <img src={meal.strMealThumb} alt="" />
                      <span className="finderResultBody"><strong>{meal.strMeal}</strong><small>{[meal.strCategory, meal.strArea].filter(Boolean).join(' · ') || 'Онлайн-рецепт'}</small><small className="finderReady"><ExternalLink size={13}/> Смотреть ингредиенты и шаги</small></span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
