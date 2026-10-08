import React, { useMemo, useState } from 'react'
import { ChefHat, Search, X, Check, ShoppingCart, Globe, LoaderCircle, ArrowLeft, ExternalLink, Languages, Sparkles } from 'lucide-react'

const aliases = {
  'яйцо': ['яйца', 'яйцо'], 'молоко': ['молоко'], 'мука': ['мука'],
  'картофель': ['картофель', 'картошка'], 'лук': ['лук', 'лук репчатый'],
  'масло': ['масло', 'растительное масло', 'сливочное масло'],
  'курица': ['куриное филе', 'куриные бёдра', 'курица'],
  'мясо': ['мясо', 'мясной фарш', 'говядина', 'свинина или говядина'],
  'сыр': ['сыр', 'пармезан', 'моцарелла', 'фета'], 'сахар': ['сахар'],
  'вода': ['вода', 'вода или бульон'], 'яблоки': ['яблоки'], 'рис': ['рис'],
  'гречка': ['гречка'], 'паста': ['паста', 'спагетти']
}

const apiIngredients = [
  { ru: ['курица', 'куриное филе', 'куриные бедра', 'куриные бёдра'], api: 'chicken_breast' },
  { ru: ['говядина', 'мясо', 'фарш'], api: 'beef' },
  { ru: ['свинина'], api: 'pork' }, { ru: ['картофель', 'картошка'], api: 'potatoes' },
  { ru: ['лук', 'лук репчатый'], api: 'onion' }, { ru: ['яйцо', 'яйца'], api: 'eggs' },
  { ru: ['молоко'], api: 'milk' }, { ru: ['сыр', 'пармезан', 'моцарелла', 'фета'], api: 'cheddar_cheese' },
  { ru: ['рис'], api: 'rice' }, { ru: ['паста', 'спагетти', 'макароны'], api: 'spaghetti' },
  { ru: ['помидор', 'помидоры', 'томат'], api: 'tomatoes' }, { ru: ['морковь'], api: 'carrots' },
  { ru: ['чеснок'], api: 'garlic' }, { ru: ['перец'], api: 'pepper' },
  { ru: ['лимон'], api: 'lemon' }, { ru: ['лосось', 'рыба'], api: 'salmon' },
  { ru: ['яблоки', 'яблоко'], api: 'apples' }, { ru: ['мука'], api: 'flour' }
]

const ingredientRu = {
  'chicken': 'курица', 'chicken breast': 'куриная грудка', 'chicken breasts': 'куриные грудки',
  'chicken thighs': 'куриные бёдра', 'beef': 'говядина', 'ground beef': 'говяжий фарш',
  'pork': 'свинина', 'potatoes': 'картофель', 'potato': 'картофель', 'onion': 'репчатый лук',
  'onions': 'репчатый лук', 'eggs': 'яйца', 'egg': 'яйцо', 'milk': 'молоко', 'cheddar cheese': 'сыр чеддер',
  'cheese': 'сыр', 'rice': 'рис', 'spaghetti': 'спагетти', 'pasta': 'макароны',
  'tomatoes': 'помидоры', 'tomato': 'помидор', 'carrots': 'морковь', 'carrot': 'морковь',
  'garlic': 'чеснок', 'black pepper': 'чёрный перец', 'pepper': 'перец', 'lemon': 'лимон',
  'salmon': 'лосось', 'apples': 'яблоки', 'apple': 'яблоко', 'flour': 'мука',
  'sugar': 'сахар', 'salt': 'соль', 'butter': 'сливочное масло', 'olive oil': 'оливковое масло',
  'vegetable oil': 'растительное масло', 'water': 'вода', 'cream': 'сливки',
  'heavy cream': 'жирные сливки', 'parsley': 'петрушка', 'basil': 'базилик',
  'oregano': 'орегано', 'paprika': 'паприка', 'cumin': 'зира', 'cinnamon': 'корица',
  'bread': 'хлеб', 'breadcrumbs': 'панировочные сухари', 'flour tortillas': 'пшеничные лепёшки',
  'bell pepper': 'сладкий перец', 'red pepper': 'красный перец', 'green pepper': 'зелёный перец',
  'mushrooms': 'грибы', 'button mushrooms': 'шампиньоны', 'broccoli': 'брокколи',
  'spinach': 'шпинат', 'cucumber': 'огурец', 'cucumbers': 'огурцы', 'lettuce': 'салат',
  'mayonnaise': 'майонез', 'mustard': 'горчица', 'soy sauce': 'соевый соус',
  'honey': 'мёд', 'vinegar': 'уксус', 'lemon juice': 'лимонный сок',
  'stock': 'бульон', 'chicken stock': 'куриный бульон', 'beef stock': 'говяжий бульон',
  'tomato puree': 'томатное пюре', 'tomato paste': 'томатная паста',
  'coconut milk': 'кокосовое молоко', 'yogurt': 'йогурт', 'yoghurt': 'йогурт',
  'parmesan': 'пармезан', 'mozzarella': 'моцарелла', 'feta': 'фета',
  'shrimp': 'креветки', 'prawns': 'креветки', 'tuna': 'тунец', 'white fish': 'белая рыба',
  'bacon': 'бекон', 'sausage': 'колбаса', 'sausages': 'колбаски',
  'sweetcorn': 'сладкая кукуруза', 'corn': 'кукуруза', 'peas': 'зелёный горошек',
  'beans': 'фасоль', 'kidney beans': 'красная фасоль', 'chickpeas': 'нут',
  'lentils': 'чечевица', 'oats': 'овсяные хлопья', 'rolled oats': 'овсяные хлопья',
  'honey': 'мёд', 'vanilla extract': 'ванильный экстракт', 'baking powder': 'разрыхлитель',
  'cocoa': 'какао', 'dark chocolate': 'тёмный шоколад', 'chocolate': 'шоколад',
  'banana': 'банан', 'bananas': 'бананы', 'strawberries': 'клубника',
  'orange': 'апельсин', 'orange juice': 'апельсиновый сок'
}

const dishRu = {
  'chicken alfredo primavera': 'Курица альфредо с овощами',
  'chicken fajita mac and cheese': 'Макароны с курицей и сыром',
  'chicken ham and leek pie': 'Пирог с курицей, ветчиной и луком-пореем',
  'chicken tikka masala': 'Курица тикка масала',
  'chicken curry': 'Курица карри',
  'chicken soup': 'Куриный суп',
  'chicken stir fry': 'Курица с овощами на сковороде',
  'beef and mustard pie': 'Пирог с говядиной и горчицей',
  'beef stroganoff': 'Бефстроганов',
  'spaghetti bolognese': 'Спагетти болоньезе',
  'lasagne': 'Лазанья',
  'lasagna': 'Лазанья',
  'fish pie': 'Рыбный пирог',
  'fish and chips': 'Рыба с картофелем фри',
  'vegetarian chilli': 'Вегетарианское чили',
  'tomato soup': 'Томатный суп',
  'french onion soup': 'Французский луковый суп',
  'apple crumble': 'Яблочный крамбл',
  'banana pancakes': 'Банановые оладьи',
  'pancakes': 'Блины',
  'carbonara': 'Паста карбонара',
  'pizza express margherita': 'Пицца «Маргарита»',
  'sushi': 'Суши',
  'katsu chicken curry': 'Курица кацу карри',
  'pad thai': 'Пад-тай',
  'fried rice': 'Жареный рис'
}
const categoryRu = {
  'beef': 'Говядина', 'chicken': 'Курица', 'dessert': 'Десерт', 'lamb': 'Баранина',
  'miscellaneous': 'Разное', 'pasta': 'Паста', 'pork': 'Свинина', 'seafood': 'Морепродукты',
  'side': 'Гарнир', 'starter': 'Закуска', 'vegan': 'Веганское', 'vegetarian': 'Вегетарианское',
  'breakfast': 'Завтрак', 'goat': 'Козлятина'
}
const areaRu = {
  'american': 'Американская кухня', 'british': 'Британская кухня', 'canadian': 'Канадская кухня',
  'chinese': 'Китайская кухня', 'croatian': 'Хорватская кухня', 'dutch': 'Голландская кухня',
  'egyptian': 'Египетская кухня', 'french': 'Французская кухня', 'greek': 'Греческая кухня',
  'indian': 'Индийская кухня', 'irish': 'Ирландская кухня', 'italian': 'Итальянская кухня',
  'jamaican': 'Ямайская кухня', 'japanese': 'Японская кухня', 'kenyan': 'Кенийская кухня',
  'malaysian': 'Малайзийская кухня', 'mexican': 'Мексиканская кухня', 'moroccan': 'Марокканская кухня',
  'polish': 'Польская кухня', 'portuguese': 'Португальская кухня', 'russian': 'Русская кухня',
  'spanish': 'Испанская кухня', 'thai': 'Тайская кухня', 'turkish': 'Турецкая кухня',
  'vietnamese': 'Вьетнамская кухня', 'tunisian': 'Тунисская кухня', 'ukrainian': 'Украинская кухня'
}

const normalize = value => value.toLowerCase().replace(/ё/g, 'е').replace(/[^а-яa-z0-9]+/g, ' ').trim()
const matches = (have, ingredient) => {
  const h = normalize(have), i = normalize(ingredient)
  if (!h || !i) return false
  if (h.includes(i) || i.includes(h)) return true
  return Object.values(aliases).some(group => group.some(item => normalize(item) === i) &&
    group.some(item => normalize(item) === h || h.includes(normalize(item)) || normalize(item).includes(h)))
}

const API = 'https://www.themealdb.com/api/json/v1/1'
const translationCache = {}
async function translateToRussian(text) {
  const value = (text || '').trim()
  if (!value) return value
  if (translationCache[value]) return translationCache[value]
  try {
    const url = new URL('https://api.mymemory.translated.net/get')
    url.searchParams.set('q', value.slice(0, 450))
    url.searchParams.set('langpair', 'en|ru')
    const response = await fetch(url.toString())
    if (!response.ok) return value
    const data = await response.json()
    const translated = data.responseData?.translatedText
    if (translated && !/MYMEMORY WARNING|PLEASE SELECT/i.test(translated)) {
      translationCache[value] = translated
      return translated
    }
  } catch { /* Keep the original text if translation service is unavailable. */ }
  return value
}

function splitForTranslation(text, max = 420) {
  const words = (text || '').replace(/\r/g, '').replace(/\n+/g, ' ').split(/\s+/).filter(Boolean)
  const chunks = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > max && current) {
      chunks.push(current.trim())
      current = word
    } else current = (current + ' ' + word).trim()
  }
  if (current) chunks.push(current)
  return chunks
}

async function translateInstructions(text, setProgress) {
  const chunks = splitForTranslation(text)
  const translated = []
  for (let i = 0; i < chunks.length; i++) {
    translated.push(await translateToRussian(chunks[i]))
    setProgress(Math.round(((i + 1) / Math.max(chunks.length, 1)) * 100))
  }
  return translated.join('\n\n')
}

function localizeMeasure(value) {
  return (value || '')
    .replace(/tablespoons?/gi, 'ст. л.')
    .replace(/tbsp/gi, 'ст. л.')
    .replace(/teaspoons?/gi, 'ч. л.')
    .replace(/tsp/gi, 'ч. л.')
    .replace(/cups?/gi, 'стак.')
    .replace(/ounces?/gi, 'унц.')
    .replace(/pounds?/gi, 'фунт.')
    .replace(/cloves?/gi, 'зубч.')
    .replace(/bunch(?:es)?/gi, 'пуч.')
    .replace(/pinch(?:es)?/gi, 'щепотка')
    .replace(/to taste/gi, 'по вкусу')
    .replace(/as needed/gi, 'по необходимости')
    .replace(/grams?/gi, 'г')
    .replace(/kilograms?/gi, 'кг')
    .replace(/millilit(?:er|re)s?/gi, 'мл')
    .replace(/lit(?:er|re)s?/gi, 'л')
    .replace(/pieces?/gi, 'шт.')
    .replace(/slices?/gi, 'ломт.')
    .replace(/large/gi, 'крупный')
    .replace(/medium/gi, 'средний')
    .replace(/small/gi, 'маленький')
    .trim()
}

function mealIngredients(meal) {
  return Array.from({ length: 20 }, (_, index) => {
    const raw = meal[`strIngredient${index + 1}`]?.trim()
    const measure = localizeMeasure(meal[`strMeasure${index + 1}`]?.trim())
    if (!raw) return null
    const ru = ingredientRu[raw.toLowerCase()] || raw
    return { raw, ru, measure }
  }).filter(Boolean)
}

const looksEnglish = value => /[a-z]/i.test(value || '') && !/[а-я]/i.test(value || '')

async function translateMealIngredients(meal) {
  const items = mealIngredients(meal)
  const translated = []
  for (const item of items) {
    const name = item.ru === item.raw && looksEnglish(item.raw)
      ? await translateToRussian(item.raw)
      : item.ru
    translated.push(`${name}${item.measure ? ` — ${item.measure}` : ''}`)
  }
  return translated
}

async function translateMetadata(value, dictionary) {
  if (!value) return ''
  const local = dictionary[value.toLowerCase()]
  if (local) return local
  if (looksEnglish(value)) return await translateToRussian(value)
  return value
}

export default function IngredientFinder({ recipes, onClose, onSelectRecipe }) {
  const [value, setValue] = useState('')
  const [onlineMeals, setOnlineMeals] = useState([])
  const [onlineLoading, setOnlineLoading] = useState(false)
  const [onlineError, setOnlineError] = useState('')
  const [selectedOnlineMeal, setSelectedOnlineMeal] = useState(null)
  const [translatedInstructions, setTranslatedInstructions] = useState('')
  const [translationLoading, setTranslationLoading] = useState(false)
  const [translationProgress, setTranslationProgress] = useState(0)
  const [translationNotice, setTranslationNotice] = useState('')
  const [translatedIngredients, setTranslatedIngredients] = useState([])
  const [translatedCategory, setTranslatedCategory] = useState('')
  const [translatedArea, setTranslatedArea] = useState('')

  const available = useMemo(() => value.split(/[,;\n]+/).map(item => item.trim()).filter(Boolean), [value])
  const results = useMemo(() => {
    if (!available.length) return []
    return recipes.map(recipe => {
      const ingredientNames = recipe.ingredients.map(item => item[0])
      const matched = ingredientNames.filter(name => available.some(have => matches(have, name)))
      const missing = ingredientNames.filter(name => !matched.includes(name))
      return { recipe, matched, missing, percent: Math.round((matched.length / ingredientNames.length) * 100) }
    }).filter(item => item.matched.length > 0)
      .sort((a, b) => b.percent - a.percent || a.missing.length - b.missing.length).slice(0, 8)
  }, [available, recipes])

  const findOnlineRecipes = async () => {
    const selectedIngredient = available.map(have => apiIngredients.find(item =>
      item.ru.some(alias => normalize(have).includes(normalize(alias)) || normalize(alias).includes(normalize(have)))
    )).find(Boolean)
    if (!selectedIngredient) {
      setOnlineError('Не удалось распознать основной продукт. Попробуй указать, например, курицу, картофель, яйца, рис или помидоры.')
      setOnlineMeals([])
      return
    }
    setOnlineLoading(true)
    setOnlineError('')
    setSelectedOnlineMeal(null)
    try {
      const response = await fetch(`${API}/filter.php?i=${encodeURIComponent(selectedIngredient.api)}`)
      if (!response.ok) throw new Error('network')
      const data = await response.json()
      const meals = (data.meals || []).slice(0, 6)
      const details = await Promise.all(meals.map(async meal => {
        const detailResponse = await fetch(`${API}/lookup.php?i=${encodeURIComponent(meal.idMeal)}`)
        if (!detailResponse.ok) return null
        const detailData = await detailResponse.json()
        const detail = detailData.meals?.[0]
        if (!detail) return null
        const translatedName = dishRu[normalize(detail.strMeal)] || await translateToRussian(detail.strMeal)
        return { ...detail, strMealRu: translatedName }
      }))
      setOnlineMeals(details.filter(Boolean))
      if (!details.some(Boolean)) setOnlineError('По этому продукту рецепты не нашлись. Попробуй другой ингредиент.')
    } catch {
      setOnlineError('Не получилось загрузить рецепты. Проверь подключение к интернету и попробуй ещё раз.')
      setOnlineMeals([])
    } finally { setOnlineLoading(false) }
  }

  const openOnlineMeal = async meal => {
    setSelectedOnlineMeal(meal)
    setTranslatedInstructions('')
    setTranslationNotice('')
    setTranslationProgress(0)
    setTranslationLoading(true)
    setTranslatedIngredients([])
    setTranslatedCategory('')
    setTranslatedArea('')
    const sourceText = meal.strInstructions || 'Инструкция не указана.'
    try {
      const [translated, ingredients, category, area] = await Promise.all([
        translateInstructions(sourceText, setTranslationProgress),
        translateMealIngredients(meal),
        translateMetadata(meal.strCategory, categoryRu),
        translateMetadata(meal.strArea, areaRu)
      ])
      setTranslatedInstructions(translated)
      setTranslatedIngredients(ingredients)
      setTranslatedCategory(category)
      setTranslatedArea(area)
      if (translated === sourceText || (looksEnglish(translated) && looksEnglish(sourceText))) {
        setTranslationNotice('Часть текста не удалось перевести автоматически. Некоторые названия или строки могут остаться на английском.')
      }
    } catch {
      setTranslatedInstructions(sourceText)
      setTranslatedIngredients(mealIngredients(meal).map(item => `${item.ru}${item.measure ? ` — ${item.measure}` : ''}`))
      setTranslationNotice('Не удалось полностью перевести рецепт. Проверь подключение к интернету; часть текста показана в оригинале.')
    } finally { setTranslationLoading(false) }
  }

  const displayName = selectedOnlineMeal?.strMealRu || selectedOnlineMeal?.strMeal
  const instructions = translationLoading ? 'Переводим инструкцию на русский…' : (translatedInstructions || selectedOnlineMeal?.strInstructions || '')

  return (
    <div className="finderOverlay" role="dialog" aria-modal="true" aria-label="Что приготовить из продуктов">
      <div className="finderCard">
        {selectedOnlineMeal ? (
          <>
            <div className="finderHeader">
              <div className="finderTitle">
                <button className="finderClose" onClick={() => setSelectedOnlineMeal(null)} aria-label="Назад"><ArrowLeft size={20}/></button>
                <div><span className="muted">FOOD · ОНЛАЙН-РЕЦЕПТ</span><h3>{displayName}</h3></div>
              </div>
              <button className="finderClose" onClick={onClose} aria-label="Закрыть"><X size={20}/></button>
            </div>
            {selectedOnlineMeal.strMealThumb && <img className="finderOnlineHero" src={selectedOnlineMeal.strMealThumb} alt={displayName} />}
            <div className="finderOnlineMeta">
              {selectedOnlineMeal.strCategory && <span>{translatedCategory || categoryRu[selectedOnlineMeal.strCategory.toLowerCase()] || selectedOnlineMeal.strCategory}</span>}
              {selectedOnlineMeal.strArea && <span>{translatedArea || areaRu[selectedOnlineMeal.strArea.toLowerCase()] || selectedOnlineMeal.strArea}</span>}
              <span><Languages size={13}/> Русский перевод</span>
            </div>
            <div className="finderOnlineSection">
              <h4>Что понадобится</h4>
              <ul>{(translatedIngredients.length ? translatedIngredients : mealIngredients(selectedOnlineMeal).map(item => `${item.ru}${item.measure ? ` — ${item.measure}` : ''}`)).map((ingredient, index) => <li key={index}>{ingredient}</li>)}</ul>
            </div>
            <div className="finderOnlineSection">
              <div className="finderInstructionHeading"><h4>Как приготовить</h4>{translationLoading && <small><LoaderCircle size={13} className="finderSpinner"/> Перевод {translationProgress}%</small>}</div>
              {translationLoading && <div className="finderTranslationProgress"><span style={{ width: `${translationProgress}%` }}/></div>}
              {translationNotice && <p className="finderTranslationNotice">{translationNotice}</p>}
              <p className="finderOnlineInstructions">{instructions.replace(/\r/g, '').split('\n').map(s => s.trim()).filter(Boolean).join('\n\n')}</p>
            </div>
            <a className="finderSourceLink" href={selectedOnlineMeal.strSource || `https://www.themealdb.com/meal/${selectedOnlineMeal.idMeal}`} target="_blank" rel="noreferrer"><ExternalLink size={15}/> Оригинал рецепта</a>
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
            <p className="finderLead">Укажи продукты, которые есть дома. Сначала покажем блюда из каталога Food, затем найдём новые рецепты с переводом на русский.</p>
            <div className="finderInputWrap">
              <Search size={18}/>
              <textarea value={value} onChange={e => { setValue(e.target.value); setOnlineMeals([]); setOnlineError('') }} placeholder="Например: картофель, яйца, молоко, сыр" rows={3} autoFocus />
            </div>
            <div className="finderExamples">
              {['картофель, яйца, сыр', 'курица, картофель, лук', 'мука, молоко, яйца'].map(example => <button key={example} onClick={() => { setValue(example); setOnlineMeals([]); setOnlineError('') }}>{example}</button>)}
            </div>
            {available.length > 0 && (
              <div className="finderResults">
                <div className="finderResultsHead"><strong>Блюда из каталога Food</strong><span>{results.length}</span></div>
                {results.length ? results.map(({ recipe, matched, missing, percent }) => (
                  <button className="finderResult" key={recipe.id} onClick={() => onSelectRecipe(recipe.id)}>
                    <img src={recipe.image} alt="" />
                    <span className="finderResultBody"><strong>{recipe.name}</strong><small>{matched.length} из {recipe.ingredients.length} ингредиентов · {percent}% совпадения</small>
                      {missing.length ? <small className="finderMissing"><ShoppingCart size={13}/> Нужно докупить: {missing.slice(0, 3).join(', ')}{missing.length > 3 ? '…' : ''}</small> : <small className="finderReady"><Check size={13}/> Всё необходимое уже есть</small>}
                    </span>
                  </button>
                )) : <div className="finderEmpty">В локальном каталоге совпадений нет. Ниже можно найти дополнительные блюда.</div>}
              </div>
            )}
            <div className="finderOnline">
              <div className="finderOnlineHeading">
                <span className="finderIcon"><Globe size={20}/></span>
                <div><strong>Больше идей для меню</strong><small>Дополнительная база рецептов · TheMealDB</small></div>
              </div>
              <button className="finderOnlineButton" onClick={findOnlineRecipes} disabled={onlineLoading || !available.length}>
                {onlineLoading ? <><LoaderCircle size={17} className="finderSpinner"/> Подбираем блюда…</> : <><Sparkles size={17}/> Найти рецепты по продуктам</>}
              </button>
              <p className="finderOnlineNote">Поиск идёт по одному основному продукту. Названия и инструкции автоматически переводятся на русский, если сервис перевода доступен.</p>
              {onlineError && <div className="finderEmpty" role="status">{onlineError}</div>}
              {onlineMeals.length > 0 && (
                <div className="finderOnlineResults">
                  <div className="finderResultsHead"><strong>Дополнительные рецепты</strong><span>{onlineMeals.length}</span></div>
                  {onlineMeals.map(meal => (
                    <button className="finderResult" key={meal.idMeal} onClick={() => openOnlineMeal(meal)}>
                      <img src={meal.strMealThumb} alt="" />
                      <span className="finderResultBody"><strong>{meal.strMealRu || meal.strMeal}</strong>
                        <small>{[categoryRu[(meal.strCategory || '').toLowerCase()] || meal.strCategory, areaRu[(meal.strArea || '').toLowerCase()] || meal.strArea].filter(Boolean).join(' · ') || 'Рецепт из открытой базы'}</small>
                        <small className="finderReady"><ChefHat size={13}/> Открыть рецепт на русском</small>
                      </span>
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
