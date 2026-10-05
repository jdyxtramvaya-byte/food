import React, { useMemo, useState } from 'react'
import { ChefHat, Search, X, Check, ShoppingCart } from 'lucide-react'

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

export default function IngredientFinder({ recipes, onClose, onSelectRecipe }) {
  const [value, setValue] = useState('')

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

  return (
    <div className="finderOverlay" role="dialog" aria-modal="true" aria-label="Что приготовить из продуктов">
      <div className="finderCard">
        <div className="finderHeader">
          <div className="finderTitle">
            <div className="finderIcon"><ChefHat size={22}/></div>
            <div><span className="muted">FOOD · УМНЫЙ ПОИСК</span><h3>Что приготовить?</h3></div>
          </div>
          <button className="finderClose" onClick={onClose} aria-label="Закрыть"><X size={20}/></button>
        </div>

        <p className="finderLead">Напишите продукты, которые есть дома. Food подберёт блюда и покажет, чего не хватает.</p>

        <div className="finderInputWrap">
          <Search size={18}/>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Например: картофель, яйца, молоко, сыр"
            rows={3}
            autoFocus
          />
        </div>

        <div className="finderExamples">
          {['картофель, яйца, сыр', 'курица, картофель, лук', 'мука, молоко, яйца'].map(example => (
            <button key={example} onClick={() => setValue(example)}>{example}</button>
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
              <div className="finderEmpty">Пока нет подходящих блюд. Добавьте ещё один-два продукта.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
