import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ChefHat, Heart, Home, Minus, Plus, Search, UtensilsCrossed, X, Sparkles, Clock3, Sun, Moon, Soup, Salad, Croissant, CakeSlice, Drumstick, Wheat, Utensils, UserRound } from 'lucide-react'
import './styles.css'
import IngredientFinder from './IngredientFinder'
import CookingMode from './CookingMode'
import MyKitchen from './MyKitchen'
import recipeDetails from './recipeDetails'
import extraRecipes from './extraRecipes'

const baseRecipes = [
  {
    id: 'borscht',
    name: 'Борщ',
    category: 'Первые блюда',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82',
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
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=82',
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
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=82',
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
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=82',
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
    id: 'solyanka', name: 'Солянка', category: 'Первые блюда', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=82', baseServings: 4,
    description: 'Густая мясная солянка с насыщенным вкусом',
    steps: ['Сварить мясной бульон.', 'Обжарить лук и добавить томатную пасту.', 'Нарезать мясные продукты и огурцы.', 'Соединить всё с бульоном и варить 15 минут.', 'Добавить маслины, зелень и дать настояться.'],
    ingredients: [['Говядина',400,'г'],['Копчёности',300,'г'],['Колбаса',200,'г'],['Лук',150,'г'],['Солёные огурцы',200,'г'],['Томатная паста',60,'г'],['Маслины',100,'г'],['Вода или бульон',1800,'мл'],['Масло',30,'мл']]
  },
  {
    id: 'chicken-potato', name: 'Курица с картофелем', category: 'Вторые блюда', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=82', baseServings: 4,
    description: 'Запечённая курица с румяным картофелем',
    steps: ['Нарезать картофель крупными кусочками.', 'Натереть курицу специями и маслом.', 'Смешать всё в форме.', 'Запекать до румяной корочки.'],
    ingredients: [['Куриные бёдра',800,'г'],['Картофель',800,'г'],['Лук',150,'г'],['Растительное масло',40,'мл'],['Паприка',6,'г'],['Чеснок',3,'зубчика'],['Соль',10,'г']]
  },
  {
    id: 'pasta', name: 'Паста с курицей', category: 'Вторые блюда', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=82', baseServings: 4,
    description: 'Сливочная паста с курицей',
    steps: ['Отварить пасту до состояния al dente.', 'Обжарить курицу до готовности.', 'Добавить сливки и сыр.', 'Соединить соус с пастой и прогреть.'],
    ingredients: [['Паста',400,'г'],['Куриное филе',500,'г'],['Сливки 20%',300,'мл'],['Сыр',120,'г'],['Лук',100,'г'],['Масло',30,'г'],['Соль',8,'г']]
  },
  {
    id: 'pilaf', name: 'Плов', category: 'Вторые блюда', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=82', baseServings: 5,
    description: 'Рассыпчатый плов с мясом и морковью',
    steps: ['Обжарить мясо до корочки.', 'Добавить лук и морковь.', 'Залить водой и приготовить зирвак.', 'Засыпать рис и довести до готовности под крышкой.'],
    ingredients: [['Рис',500,'г'],['Мясо',600,'г'],['Морковь',350,'г'],['Лук',200,'г'],['Масло',80,'мл'],['Чеснок',1,'головка'],['Вода',750,'мл'],['Зира',5,'г']]
  },
  {
    id: 'greek-salad', name: 'Греческий салат', category: 'Салаты', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=82', baseServings: 4,
    description: 'Свежий салат с овощами и фетой',
    steps: ['Нарезать овощи крупными кусочками.', 'Добавить фету и маслины.', 'Заправить оливковым маслом.', 'Посолить и аккуратно перемешать.'],
    ingredients: [['Помидоры',400,'г'],['Огурцы',300,'г'],['Болгарский перец',150,'г'],['Фета',200,'г'],['Маслины',100,'г'],['Красный лук',80,'г'],['Оливковое масло',40,'мл']]
  },
  {
    id: 'caesar', name: 'Цезарь с курицей', category: 'Салаты', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=82', baseServings: 4,
    description: 'Хрустящий салат с курицей и соусом',
    steps: ['Обжарить куриное филе.', 'Подготовить салат и сухарики.', 'Смешать ингредиенты с соусом.', 'Посыпать пармезаном.'],
    ingredients: [['Куриное филе',400,'г'],['Салат ромэн',300,'г'],['Пармезан',80,'г'],['Сухарики',120,'г'],['Соус Цезарь',160,'г'],['Помидоры черри',200,'г']]
  },
  {
    id: 'syrniki', name: 'Сырники', category: 'Завтраки', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=82', baseServings: 4,
    description: 'Нежные сырники с золотистой корочкой',
    steps: ['Смешать творог, яйцо, сахар и муку.', 'Сформировать небольшие сырники.', 'Обвалять в муке.', 'Обжарить с двух сторон до золотистой корочки.'],
    ingredients: [['Творог',500,'г'],['Яйца',2,'шт.'],['Мука',80,'г'],['Сахар',50,'г'],['Масло',30,'мл'],['Ванильный сахар',8,'г']]
  },
  {
    id: 'omelette', name: 'Омлет', category: 'Завтраки', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=82', baseServings: 2,
    description: 'Пышный домашний омлет',
    steps: ['Взбить яйца с молоком и солью.', 'Разогреть сковороду с маслом.', 'Вылить смесь и готовить под крышкой.', 'Добавить зелень перед подачей.'],
    ingredients: [['Яйца',4,'шт.'],['Молоко',120,'мл'],['Масло',15,'г'],['Соль',3,'г'],['Зелень',10,'г']]
  },
  {
    id: 'mashed-potato', name: 'Картофельное пюре', category: 'Гарниры', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=82', baseServings: 4,
    description: 'Нежное сливочное картофельное пюре',
    steps: ['Очистить и отварить картофель.', 'Слить воду и размять картофель.', 'Добавить горячее молоко и масло.', 'Перемешать до однородности.'],
    ingredients: [['Картофель',800,'г'],['Молоко',200,'мл'],['Сливочное масло',60,'г'],['Соль',8,'г']]
  },
  {
    id: 'buckwheat', name: 'Гречка', category: 'Гарниры', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=82', baseServings: 4,
    description: 'Рассыпчатая гречка на каждый день',
    steps: ['Промыть крупу.', 'Залить водой в пропорции 1:2.', 'Посолить и довести до кипения.', 'Варить под крышкой до готовности.'],
    ingredients: [['Гречка',300,'г'],['Вода',600,'мл'],['Сливочное масло',40,'г'],['Соль',6,'г']]
  },
  {
    id: 'pizza', name: 'Домашняя пицца', category: 'Выпечка', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=82', baseServings: 4,
    description: 'Тонкая пицца с сыром и ветчиной',
    steps: ['Замесить тесто и дать ему подойти.', 'Раскатать основу.', 'Добавить соус, начинку и сыр.', 'Выпекать в максимально горячей духовке.'],
    ingredients: [['Мука',300,'г'],['Вода',180,'мл'],['Дрожжи',7,'г'],['Томатный соус',120,'г'],['Моцарелла',250,'г'],['Ветчина',180,'г'],['Масло',20,'мл']]
  },
  {
    id: 'apple-pie', name: 'Яблочный пирог', category: 'Выпечка', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=82', baseServings: 6,
    description: 'Мягкий домашний пирог с яблоками',
    steps: ['Взбить яйца с сахаром.', 'Добавить муку и разрыхлитель.', 'Нарезать яблоки и выложить в форму.', 'Залить тестом и выпекать до готовности.'],
    ingredients: [['Яблоки',500,'г'],['Мука',200,'г'],['Яйца',3,'шт.'],['Сахар',150,'г'],['Сливочное масло',100,'г'],['Разрыхлитель',8,'г']]
  },
  {
    id: 'charlotte', name: 'Шарлотка', category: 'Десерты', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=82', baseServings: 6,
    description: 'Воздушная шарлотка с яблоками',
    steps: ['Взбить яйца с сахаром.', 'Аккуратно вмешать муку.', 'Выложить яблоки в форму.', 'Залить тестом и выпекать до золотистой корочки.'],
    ingredients: [['Яблоки',500,'г'],['Яйца',4,'шт.'],['Мука',160,'г'],['Сахар',150,'г'],['Разрыхлитель',5,'г']]
  },
  {
    id: 'pasta-carbonara', name: 'Карбонара', category: 'Вторые блюда', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=82', baseServings: 2,
    description: 'Паста с беконом, яйцом и сыром',
    steps: ['Отварить спагетти.', 'Обжарить бекон.', 'Смешать яйца с сыром.', 'Соединить горячую пасту с беконом и яичной смесью.'],
    ingredients: [['Спагетти',200,'г'],['Бекон',120,'г'],['Яйца',2,'шт.'],['Пармезан',70,'г'],['Чёрный перец',3,'г']]
  }, 
  {id:'shchi',name:'Щи из свежей капусты',category:'Первые блюда',image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Лёгкий домашний суп с капустой',steps:['Сварить мясо и снять пену.','Добавить картофель и капусту.','Обжарить морковь с луком.','Добавить зажарку и варить до мягкости овощей.','Дать супу настояться 10 минут.'],ingredients:[['Курица',500,'г'],['Капуста',450,'г'],['Картофель',400,'г'],['Морковь',120,'г'],['Лук',120,'г'],['Масло',25,'мл'],['Вода',1800,'мл']]},
  {id:'rassolnik',name:'Рассольник',category:'Первые блюда',image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Наваристый суп с перловкой и солёными огурцами',steps:['Сварить мясной бульон.','Отдельно отварить перловку.','Добавить картофель и крупу в бульон.','Обжарить лук и морковь.','Добавить огурцы и зажарку, довести до готовности.'],ingredients:[['Говядина',400,'г'],['Перловка',100,'г'],['Картофель',400,'г'],['Солёные огурцы',180,'г'],['Морковь',120,'г'],['Лук',120,'г'],['Вода',1800,'мл']]},
  {id:'chicken-soup',name:'Куриный суп с лапшой',category:'Первые блюда',image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Простой домашний суп с курицей и лапшой',steps:['Сварить курицу до готовности.','Добавить картофель и морковь.','Положить лапшу за 7 минут до конца.','Посолить и добавить зелень.'],ingredients:[['Куриное филе',450,'г'],['Картофель',350,'г'],['Морковь',120,'г'],['Лапша',120,'г'],['Лук',100,'г'],['Вода',1800,'мл']]},
  {id:'beef-goulash',name:'Гуляш из говядины',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Мягкая говядина в густом соусе',steps:['Нарезать говядину кубиками и обсушить.','Обжарить порциями до корочки.','Добавить лук и паприку.','Влить воду и тушить под крышкой.','Загустить соус сметаной или мукой.'],ingredients:[['Говядина',700,'г'],['Лук',180,'г'],['Морковь',120,'г'],['Томатная паста',50,'г'],['Мука',25,'г'],['Масло',40,'мл']]},
  {id:'chicken-cutlets',name:'Куриные котлеты',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Нежные котлеты из куриного филе',steps:['Измельчить филе и лук.','Добавить яйцо, сметану и крахмал.','Посолить и перемешать.','Обжаривать ложкой с двух сторон до готовности.'],ingredients:[['Куриное филе',600,'г'],['Лук',120,'г'],['Яйца',1,'шт.'],['Сметана',80,'г'],['Крахмал',30,'г'],['Масло',40,'мл']]},
  {id:'fried-potatoes',name:'Жареная картошка',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Картофель с хрустящей корочкой и луком',steps:['Нарезать картофель и промыть.','Хорошо обсушить.','Жарить на горячей сковороде без частого перемешивания.','Добавить лук ближе к концу.','Посолить после образования корочки.'],ingredients:[['Картофель',900,'г'],['Лук',150,'г'],['Масло',70,'мл']]},
  {id:'beef-stroganoff',name:'Бефстроганов',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Нежная говядина в сметанном соусе',steps:['Нарезать мясо тонкими полосками.','Быстро обжарить на сильном огне.','Добавить лук.','Ввести сметану и немного воды.','Тушить 10 минут.'],ingredients:[['Говядина',600,'г'],['Лук',180,'г'],['Сметана',250,'г'],['Мука',20,'г'],['Масло',40,'мл']]},
  {id:'fish-baked',name:'Рыба в духовке',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Запечённое рыбное филе с лимоном',steps:['Обсушить филе.','Посолить, поперчить и сбрызнуть лимоном.','Выложить в форму с луком.','Запекать до готовности.'],ingredients:[['Рыбное филе',700,'г'],['Лимон',1,'шт.'],['Лук',120,'г'],['Масло',30,'мл']]},
  {id:'meat-french',name:'Мясо по-французски',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Мясо с луком, сыром и запечённой корочкой',steps:['Нарезать мясо пластинами и слегка отбить.','Выложить лук и мясо в форму.','Смазать сметаной.','Посыпать сыром.','Запекать до золотистой корочки.'],ingredients:[['Свинина',600,'г'],['Лук',180,'г'],['Сыр',180,'г'],['Сметана',180,'г']]},
  {id:'mac-cheese',name:'Макароны с сыром',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=900&q=82',baseServings:3,description:'Быстрое сливочное блюдо для всей семьи',steps:['Отварить макароны.','Растопить масло и добавить сливки.','Всыпать сыр.','Соединить соус с горячими макаронами.'],ingredients:[['Макароны',300,'г'],['Сыр',180,'г'],['Сливки',200,'мл'],['Сливочное масло',40,'г']]},
  {id:'draniki',name:'Драники',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=82',baseServings:3,description:'Хрустящие картофельные драники',steps:['Натереть картофель и слегка отжать.','Добавить яйцо, муку и лук.','Посолить перед жаркой.','Жарить до румяной корочки.'],ingredients:[['Картофель',700,'г'],['Лук',100,'г'],['Яйца',1,'шт.'],['Мука',50,'г'],['Масло',60,'мл']]},
  {id:'vinaigrette',name:'Винегрет',category:'Салаты',image:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Овощной салат со свёклой и солёными огурцами',steps:['Отварить свёклу, картофель и морковь.','Остудить и нарезать кубиками.','Добавить огурцы и горошек.','Заправить маслом и перемешать.'],ingredients:[['Свёкла',300,'г'],['Картофель',300,'г'],['Морковь',150,'г'],['Солёные огурцы',180,'г'],['Горошек',150,'г'],['Масло',40,'мл']]},
  {id:'crab-salad',name:'Крабовый салат',category:'Салаты',image:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Нежный салат с кукурузой и крабовыми палочками',steps:['Отварить яйца.','Нарезать палочки и яйца.','Добавить кукурузу и огурец.','Заправить майонезом.'],ingredients:[['Крабовые палочки',250,'г'],['Яйца',4,'шт.'],['Кукуруза',250,'г'],['Огурец',200,'г'],['Майонез',150,'г']]},
  {id:'tomato-cucumber',name:'Салат из помидоров и огурцов',category:'Салаты',image:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=82',baseServings:3,description:'Свежий салат на каждый день',steps:['Нарезать овощи.','Добавить лук и зелень.','Заправить маслом.','Посолить перед подачей.'],ingredients:[['Помидоры',400,'г'],['Огурцы',300,'г'],['Лук',70,'г'],['Зелень',20,'г'],['Масло',30,'мл']]},
  {id:'hot-sandwiches',name:'Горячие бутерброды',category:'Завтраки',image:'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=82',baseServings:2,description:'Хрустящие бутерброды с сыром и ветчиной',steps:['Намазать хлеб соусом.','Добавить ветчину и сыр.','Запечь до расплавления сыра.'],ingredients:[['Хлеб',4,'шт.'],['Ветчина',100,'г'],['Сыр',120,'г']]},
  {id:'french-toast',name:'Гренки сладкие',category:'Завтраки',image:'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=82',baseServings:2,description:'Румяные гренки к завтраку',steps:['Взбить яйцо с молоком и сахаром.','Обмакнуть хлеб с двух сторон.','Обжарить на масле до золотистой корочки.'],ingredients:[['Белый хлеб',4,'ломтика'],['Яйца',2,'шт.'],['Молоко',100,'мл'],['Сахар',20,'г'],['Масло',25,'г']]},
  {id:'oatmeal',name:'Овсяная каша',category:'Завтраки',image:'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=900&q=82',baseServings:2,description:'Кремовая овсяная каша с фруктами',steps:['Нагреть молоко.','Всыпать овсянку и варить до мягкости.','Добавить соль и сахар.','Подать с маслом и фруктами.'],ingredients:[['Овсяные хлопья',100,'г'],['Молоко',400,'мл'],['Сахар',20,'г'],['Сливочное масло',20,'г'],['Банан',1,'шт.']]},
  {id:'scrambled-eggs',name:'Яичница с помидорами',category:'Завтраки',image:'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=82',baseServings:2,description:'Простой сытный завтрак за 10 минут',steps:['Нарезать помидоры.','Обжарить их 2–3 минуты.','Разбить яйца сверху.','Посолить и готовить до желаемой степени.'],ingredients:[['Яйца',4,'шт.'],['Помидоры',200,'г'],['Масло',20,'мл']]},
  {id:'rice-garnish',name:'Рис на гарнир',category:'Гарниры',image:'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Рассыпчатый рис без лишних сложностей',steps:['Промыть рис до прозрачной воды.','Залить водой.','Довести до кипения.','Варить под крышкой на минимальном огне.','Оставить под крышкой ещё 10 минут.'],ingredients:[['Рис',300,'г'],['Вода',450,'мл'],['Соль',6,'г'],['Сливочное масло',30,'г']]},
  {id:'buckwheat-mushrooms',name:'Гречка с грибами',category:'Гарниры',image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=82',baseServings:3,description:'Гречка с обжаренными грибами и луком',steps:['Сварить гречку.','Обжарить грибы до испарения влаги.','Добавить лук.','Смешать с гречкой и прогреть.'],ingredients:[['Гречка',250,'г'],['Шампиньоны',300,'г'],['Лук',120,'г'],['Масло',35,'мл']]},
  {id:'casserole',name:'Картофельная запеканка',category:'Гарниры',image:'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Сытная запеканка с картофелем и фаршем',steps:['Сделать картофельное пюре.','Обжарить фарш с луком.','Выложить слоями пюре и фарш.','Добавить сыр.','Запекать до румяной корочки.'],ingredients:[['Картофель',800,'г'],['Мясной фарш',500,'г'],['Лук',150,'г'],['Сыр',120,'г'],['Молоко',100,'мл']]},
  {id:'banana-pancakes',name:'Банановые панкейки',category:'Завтраки',image:'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=82',baseServings:3,description:'Мягкие панкейки с бананом',steps:['Размять банан.','Добавить яйцо и молоко.','Вмешать муку и разрыхлитель.','Жарить небольшими порциями.'],ingredients:[['Банан',2,'шт.'],['Яйца',2,'шт.'],['Молоко',150,'мл'],['Мука',160,'г'],['Разрыхлитель',6,'г']]},
  {id:'muffins',name:'Ванильные маффины',category:'Выпечка',image:'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=82',baseServings:6,description:'Мягкие порционные кексы',steps:['Смешать яйца, сахар и масло.','Добавить молоко и ваниль.','Вмешать муку и разрыхлитель.','Разложить по формочкам.','Выпекать до сухой шпажки.'],ingredients:[['Мука',220,'г'],['Яйца',2,'шт.'],['Сахар',120,'г'],['Молоко',120,'мл'],['Сливочное масло',80,'г'],['Разрыхлитель',8,'г']]},
  {id:'cookies',name:'Песочное печенье',category:'Выпечка',image:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=82',baseServings:6,description:'Рассыпчатое домашнее печенье',steps:['Перетереть масло с сахаром.','Добавить яйцо и муку.','Замесить тесто.','Охладить 20 минут.','Раскатать и выпекать до румянца.'],ingredients:[['Мука',300,'г'],['Сливочное масло',150,'г'],['Сахар',100,'г'],['Яйца',1,'шт.']]},
  {id:'cheesecake',name:'Чизкейк без выпечки',category:'Десерты',image:'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=82',baseServings:6,description:'Нежный сливочный десерт без духовки',steps:['Измельчить печенье и смешать с маслом.','Утрамбовать основу.','Взбить сливочный сыр со сливками и сахаром.','Выложить крем на основу.','Охладить минимум 4 часа.'],ingredients:[['Печенье',250,'г'],['Сливочное масло',100,'г'],['Сливочный сыр',500,'г'],['Сливки',250,'мл'],['Сахарная пудра',100,'г']]},
  {id:'apple-crumble',name:'Яблочный крамбл',category:'Десерты',image:'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Запечённые яблоки под хрустящей крошкой',steps:['Нарезать яблоки.','Смешать муку, сахар и холодное масло в крошку.','Распределить крошку по яблокам.','Запекать до золотистой корочки.'],ingredients:[['Яблоки',500,'г'],['Мука',120,'г'],['Сливочное масло',80,'г'],['Сахар',80,'г'],['Корица',3,'г']]},
  {id:'puff-pastry',name:'Слойки с сыром',category:'Выпечка',image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Хрустящие слойки с сырной начинкой',steps:['Разморозить тесто.','Добавить сыр.','Сформировать слойки.','Смазать яйцом.','Выпекать до золотистого цвета.'],ingredients:[['Слоёное тесто',500,'г'],['Сыр',200,'г'],['Яйца',1,'шт.']]},
  {id:'stuffed-peppers',name:'Фаршированные перцы',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Перцы с мясом и рисом в томатном соусе',steps:['Смешать фарш с полуготовым рисом и луком.','Наполнить перцы.','Выложить в кастрюлю.','Залить томатным соусом.','Тушить до мягкости.'],ingredients:[['Болгарский перец',6,'шт.'],['Мясной фарш',500,'г'],['Рис',120,'г'],['Лук',120,'г'],['Томатный соус',400,'г']]},
  {id:'meatballs',name:'Тефтели в соусе',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Нежные тефтели в томатно-сметанном соусе',steps:['Смешать фарш с рисом и луком.','Сформировать шарики.','Слегка обжарить.','Залить соусом.','Тушить до готовности.'],ingredients:[['Мясной фарш',500,'г'],['Рис',100,'г'],['Лук',120,'г'],['Сметана',150,'г'],['Томатная паста',50,'г']]},
  {id:'chicken-chops',name:'Куриные отбивные',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=82',baseServings:3,description:'Тонкие сочные отбивные в хрустящей корочке',steps:['Разрезать филе пластинами.','Отбить через плёнку.','Посолить и поперчить.','Обмакнуть в яйцо и сухари.','Жарить до золотистой корочки.'],ingredients:[['Куриное филе',500,'г'],['Яйца',2,'шт.'],['Панировочные сухари',100,'г'],['Масло',50,'мл']]},
  {id:'vegetable-stew',name:'Овощное рагу',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Сочное рагу из сезонных овощей',steps:['Нарезать овощи одинаковыми кусочками.','Обжарить лук и морковь.','Добавить картофель и перец.','Добавить кабачок и томаты.','Тушить до мягкости.'],ingredients:[['Картофель',400,'г'],['Кабачок',300,'г'],['Помидоры',300,'г'],['Морковь',150,'г'],['Перец',150,'г'],['Лук',120,'г']]},
  {id:'chicken-pasta-tomato',name:'Паста с курицей и томатами',category:'Вторые блюда',image:'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=82',baseServings:4,description:'Паста в томатном соусе с курицей',steps:['Отварить пасту.','Обжарить курицу.','Добавить чеснок и томатный соус.','Потушить соус.','Соединить с пастой и сыром.'],ingredients:[['Паста',350,'г'],['Куриное филе',450,'г'],['Томатный соус',300,'г'],['Чеснок',2,'зубчика'],['Сыр',80,'г']]},
  {id:'meat-pie',name:'Пирог с мясом',category:'Выпечка',image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=82',baseServings:6,description:'Сытный домашний пирог с мясной начинкой',steps:['Замесить дрожжевое тесто.','Обжарить фарш с луком.','Выложить начинку между слоями теста.','Смазать яйцом.','Выпекать до румяной корочки.'],ingredients:[['Мука',450,'г'],['Мясной фарш',450,'г'],['Лук',150,'г'],['Яйца',1,'шт.'],['Дрожжи',7,'г'],['Молоко',200,'мл']]}

]

const recipes = [...baseRecipes, ...extraRecipes]
const categories = ['Первые блюда', 'Вторые блюда', 'Салаты', 'Завтраки', 'Гарниры', 'Выпечка', 'Десерты']
const categoryIcons = {
  'Первые блюда': Soup,
  'Вторые блюда': Drumstick,
  'Салаты': Salad,
  'Завтраки': Croissant,
  'Гарниры': Wheat,
  'Выпечка': Utensils,
  'Десерты': CakeSlice
}

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

function readAppState() {
  try {
    if (typeof window === 'undefined') return {}
    const saved = JSON.parse(window.localStorage.getItem('food-app-state') || '{}')
    return saved && typeof saved === 'object' ? saved : {}
  } catch {
    return {}
  }
}

function writeAppState(value) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('food-app-state', JSON.stringify(value))
    }
  } catch {
    // The app remains usable if browser storage is unavailable.
  }
}

function formatAmount(value, unit) {
  const rounded = Math.round(value * 10) / 10
  if (unit === 'г' && rounded >= 1000) return `${Math.round(rounded / 1000 * 10) / 10} кг`
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
            <div className="errorIcon"><ChefHat size={42} /></div>
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

function DishIcon({ recipe, size = 22 }) {
  const Icon = ['olivier', 'greek-salad', 'caesar', 'buckwheat', 'apple-pie', 'charlotte'].includes(recipe.id)
    ? Sparkles
    : UtensilsCrossed
  return <Icon size={size} strokeWidth={1.8} />
}

function App() {
  const [selectedId, setSelectedId] = useState(() => readAppState().selectedId ?? null)
  const [servings, setServings] = useState(() => Math.min(50, Math.max(1, Number(readAppState().servings) || 2)))
  const [category, setCategory] = useState(() => readAppState().category || 'Все')
  const [query, setQuery] = useState(() => readAppState().query || '')
  const [favorites, setFavorites] = useState(readFavorites)
  const [tab, setTab] = useState(() => {
    const savedTab = readAppState().tab
    return ['favorites', 'recipes', 'kitchen'].includes(savedTab) ? savedTab : 'home'
  })
  const [showSteps, setShowSteps] = useState(() => Boolean(readAppState().showSteps))
  const [showFinder, setShowFinder] = useState(false)
  const [theme, setTheme] = useState(() => {
    try { return window.localStorage.getItem('food-theme') || 'light' } catch { return 'light' }
  })

  const selected = recipes.find(r => r.id === selectedId) || null

  const filtered = useMemo(() => recipes.filter(r => {
    const matchesCategory = category === 'Все' || r.category === category
    const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase())
    const matchesTab = tab !== 'favorites' || favorites.includes(r.id)
    return matchesCategory && matchesQuery && matchesTab
  }), [category, query, tab, favorites])

  const multiplier = selected ? servings / selected.baseServings : 1

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { window.localStorage.setItem('food-theme', theme) } catch {}
  }, [theme])

  React.useEffect(() => {
    writeAppState({ selectedId, servings, category, query, tab, showSteps })
  }, [selectedId, servings, category, query, tab, showSteps])

  const saveFavorites = (next) => { setFavorites(next); writeFavorites(next) }

  const toggleFavorite = (id) => {
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]
    saveFavorites(next)
  }

  const selectRecipe = (id) => {
    setSelectedId(id)
    setServings(2)
    setShowSteps(false)
    setTab('recipes')
  }

  const selectFinderRecipe = (id) => {
    const recipe = recipes.find(item => item.id === id)
    if (recipe) setCategory(recipe.category)
    setShowFinder(false)
    selectRecipe(id)
  }

  const openCategory = (item) => {
    setCategory(item)
    setSelectedId(null)
    setQuery('')
    setTab('recipes')
  }

  const goHome = () => {
    setSelectedId(null)
    setCategory('Все')
    setQuery('')
    setShowSteps(false)
    setShowFinder(false)
    setTab('home')
  }

  const goRecipes = () => {
    setSelectedId(null)
    setCategory('Все')
    setQuery('')
    setShowSteps(false)
    setShowFinder(false)
    setTab('recipes')
  }

  const goKitchen = () => {
    setSelectedId(null)
    setShowSteps(false)
    setShowFinder(false)
    setTab('kitchen')
  }

  const goFavorites = () => {
    setSelectedId(null)
    setCategory('Все')
    setQuery('')
    setShowSteps(false)
    setShowFinder(false)
    setTab('favorites')
  }

  const backToCategories = () => {
    goHome()
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
        <div className="headerActions">
          <div className="headerMeta">Домашняя кухня</div>
          <button className="themeToggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'} title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow"><Sparkles size={13}/> ДОМАШНЯЯ КУХНЯ</span>
          <h2>Готовим точно столько, сколько нужно.</h2>
          <p>Рецепты, точные пропорции и понятные шаги. Выберите блюдо — остальное Food посчитает сам.</p>
          <button className="finderHeroButton" onClick={() => setShowFinder(true)}><ChefHat size={18}/><span><strong>Что приготовить из того, что есть?</strong><small>Введите продукты — Food подберёт блюда</small></span><span className="finderHeroArrow">›</span></button>
        </div>
      </section>

      {!selected ? (
        tab === 'kitchen' ? <MyKitchen recipes={recipes} favorites={favorites} onSelectRecipe={selectRecipe} onOpenFinder={() => setShowFinder(true)} /> : tab === 'favorites' ? (
          <section className="categoryDishes">
            <div className="categoryDishesHeader">
              <button className="backButton" onClick={backToCategories}>‹ Категории</button>
              <span className="muted">Сохранённые блюда</span>
              <h3>Избранное</h3>
              <p>Ваши любимые рецепты в одном месте.</p>
            </div>
            {filtered.length ? (
              <div className="dishGrid">
                {filtered.map(recipe => (
                  <button key={recipe.id} className="dishTile" onClick={() => selectRecipe(recipe.id)}>
                    <img src={recipe.image} alt={recipe.name} loading="lazy" />
                    <span><strong>{recipe.name}</strong><small>{recipe.description}</small></span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="categoryDishesHeader">
                <p>Пока нет сохранённых блюд. Нажмите сердечко у рецепта, чтобы добавить его сюда.</p>
              </div>
            )}
          </section>
        ) : tab === 'recipes' ? (
          <section className="categoryDishes recipeLibraryPage">
            <div className="categoryDishesHeader">
              <button className="backButton" onClick={goHome}>‹ Главная</button>
              <span className="muted">Библиотека FOOD</span>
              <h3>Все рецепты</h3>
              <p>Найдите блюдо или выберите рецепт, чтобы рассчитать ингредиенты.</p>
            </div>
            <div className="librarySearch"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск рецепта..." aria-label="Поиск рецепта"/>{query && <button onClick={() => setQuery('')} aria-label="Очистить поиск"><X size={16}/></button>}</div>
            {filtered.length ? (
              <div className="dishGrid">
                {filtered.map(recipe => (
                  <button key={recipe.id} className="dishTile" onClick={() => selectRecipe(recipe.id)}>
                    <img src={recipe.image} alt={recipe.name} loading="lazy" />
                    <span><strong>{recipe.name}</strong><small>{recipe.description}</small></span>
                  </button>
                ))}
              </div>
            ) : <div className="categoryDishesHeader"><p>По вашему запросу ничего не найдено.</p></div>}
          </section>
        ) : category === 'Все' ? (
          <section className="categoryHome">
            <div className="categoryIntro">
              <span className="muted">Выберите раздел</span>
              <h3>Что будем готовить?</h3>
              <p>Сначала выберите категорию, затем блюдо — и Food рассчитает продукты под нужное количество людей.</p>
            </div>
            <div className="categoryGrid">
              <button className="categoryTile finderCategoryTile" onClick={() => setShowFinder(true)}>
                <span className="categoryTileIcon"><ChefHat size={28} strokeWidth={1.7} /></span>
                <span className="categoryTileText"><strong>Из моих продуктов</strong><small>Подобрать блюдо</small></span>
                <span className="categoryTileArrow">›</span>
              </button>
              {categories.map(item => {
                const Icon = categoryIcons[item]
                const count = recipes.filter(r => r.category === item).length
                const cover = recipes.find(r => r.category === item && r.image)?.image
                return (
                  <button key={item} className="categoryTile" onClick={() => openCategory(item)}>
                    <span className="categoryTileImage" aria-hidden="true">{cover && <img src={cover} alt="" loading="lazy" />}</span>
                    <span className="categoryTileIcon"><Icon size={22} strokeWidth={1.8} /></span>
                    <span className="categoryTileText"><strong>{item}</strong><small>{count} {count === 1 ? 'блюдо' : count < 5 ? 'блюда' : 'блюд'}</small></span>
                    <span className="categoryTileArrow">↗</span>
                  </button>
                )
              })}
            </div>
          </section>
        ) : (
          <section className="categoryDishes">
            <div className="categoryDishesHeader">
              <button className="backButton" onClick={backToCategories}>‹ Категории</button>
              <span className="muted">Раздел блюд</span>
              <h3>{category}</h3>
              <p>Выберите блюдо — после этого Food откроет калькулятор ингредиентов.</p>
            </div>
            <div className="dishGrid">
              {filtered.map(recipe => (
                <button key={recipe.id} className="dishTile" onClick={() => selectRecipe(recipe.id)}>
                  <img src={recipe.image} alt={recipe.name} loading="lazy" />
                  <span><strong>{recipe.name}</strong><small>{recipe.description}</small></span>
                </button>
              ))}
            </div>
          </section>
        )
      ) : (
        <div className="workspace">
          <aside className="sidebar">
            <div className="backRow"><button className="backButton" onClick={backToCategories}>‹ Категории</button></div>
            <div className="sidebarTitle"><span className="libraryLabel">{category}</span><span>Блюда</span><span className="count">{filtered.length}</span></div>
            <div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Найти блюдо..."/>{query && <button className="clearSearch" onClick={() => setQuery('')} aria-label="Очистить"><X size={15}/></button>}</div>
            <div className="recipeList">
              {filtered.length ? filtered.map(recipe => (
                <button key={recipe.id} className={selected.id === recipe.id ? 'recipe active' : 'recipe'} onClick={() => selectRecipe(recipe.id)}>
                  <span className="recipeEmoji"><DishIcon recipe={recipe} size={22}/></span>
                  <span className="recipeText"><strong>{recipe.name}</strong><small>{recipe.category}</small></span>
                  <Heart className={favorites.includes(recipe.id) ? 'miniHeart liked' : 'miniHeart'} size={15} fill={favorites.includes(recipe.id) ? 'currentColor' : 'none'}/>
                </button>
              )) : <div className="empty">В этой категории пока нет блюд.</div>}
            </div>
          </aside>
          <section className="card">
            <div className="recipeCover recipeCoverEditorial">
              <img src={selected.image} alt={selected.name} loading="eager"/>
              <div className="recipeCoverShade"/>
              <span className="recipeCoverLabel"><UtensilsCrossed size={14}/>{selected.category}</span>
              <button className={favorites.includes(selected.id) ? 'favoriteButton active' : 'favoriteButton'} onClick={() => toggleFavorite(selected.id)} aria-label="Добавить в избранное"><Heart size={19} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'}/></button>
              <div className="recipeCoverCopy">
                <span className="recipeCoverKicker">РЕЦЕПТ ДНЯ · FOOD</span>
                <h3>{selected.name}</h3>
                <p>{selected.description}</p>
                <div className="recipeCoverMeta"><span><Clock3 size={15}/>{recipeDetails[selected.id]?.time || '30–60 мин'}</span><span><UtensilsCrossed size={15}/>{servings} {pluralPeople(servings)}</span><span>{recipeDetails[selected.id]?.difficulty || 'Средне'}</span></div>
              </div>
            </div>
            <div className="recipeIntroLine"><span>{selected.ingredients.length} ингредиентов</span><span className="recipeIntroDot"/> <span>Пропорции настраиваются под вас</span></div>
            <section className="portionLab" aria-label="Калькулятор порций">
              <div className="portionLabTop"><span className="portionLiveDot"/><span>РЕЖИМ ПРИГОТОВЛЕНИЯ</span><span className="portionLabLine"/><Sparkles size={15}/></div>
              <div className="portionLabBody">
                <div className="portionOrbit" aria-hidden="true"><div className="portionOrbitRing portionOrbitRingOne"/><div className="portionOrbitRing portionOrbitRingTwo"/><div className="portionOrbitCore"><span className="portionNumber">{String(servings).padStart(2,'0')}</span><span className="portionUnit">ПОРЦИИ</span></div><span className="portionOrbitNode portionOrbitNodeOne"/><span className="portionOrbitNode portionOrbitNodeTwo"/></div>
                <div className="portionLabControls">
                  <span className="portionLabEyebrow">МАСШТАБ РЕЦЕПТА</span>
                  <h3>Готовим<br/>на свой вкус.</h3>
                  <p>Меняйте количество — ингредиенты пересчитаются сами.</p>
                  <div className="portionAdjust"><button onClick={() => setServings(Math.max(1, servings - 1))} aria-label="Уменьшить количество порций" disabled={servings <= 1}><Minus size={17}/></button><span>{servings} <small>{pluralPeople(servings)}</small></span><button onClick={() => setServings(Math.min(50, servings + 1))} aria-label="Увеличить количество порций" disabled={servings >= 50}><Plus size={17}/></button></div>
                </div>
              </div>
              <div className="portionPresets"><span>БЫСТРЫЙ ВЫБОР</span>{[1,2,4,6,8].map(n => <button key={n} className={servings === n ? 'portionPreset active' : 'portionPreset'} onClick={() => setServings(n)} aria-pressed={servings === n}>{String(n).padStart(2,'0')}</button>)}<span className="portionPresetMax">до 50</span></div>
            </section>
            <div className="sectionHeading"><div><span>Ингредиенты</span><small>Количество автоматически пересчитано</small></div><b>{selected.ingredients.length}</b></div>
            <div className="tableHead"><span>ИНГРЕДИЕНТ</span><span>КОЛИЧЕСТВО</span></div>
            <div className="ingredients">{selected.ingredients.map(([name, amount, unit]) => <div className="ingredient" key={name}><span>{name}</span><strong>{formatAmount(amount * multiplier, unit)}</strong></div>)}</div>
            <div className="cardActions"><button className={showSteps ? 'secondaryAction active' : 'secondaryAction'} onClick={() => setShowSteps(!showSteps)}><UtensilsCrossed size={17}/>{showSteps ? 'Скрыть приготовление' : 'Как приготовить'}</button></div>
            {showSteps && <div className="steps"><div className="stepsTitle">Приготовление</div><div className="recipeDetailGrid"><div><small>Время</small><strong>{recipeDetails[selected.id]?.time || '30–60 мин'}</strong></div><div><small>Сложность</small><strong>{recipeDetails[selected.id]?.difficulty || 'Средне'}</strong></div><div><small>Инвентарь</small><strong>{recipeDetails[selected.id]?.equipment || 'Кастрюля, сковорода'}</strong></div></div><CookingMode recipe={selected} steps={recipeDetails[selected.id]?.detailedSteps || selected.steps} tip={recipeDetails[selected.id]?.tip} substitutions={recipeDetails[selected.id]?.substitutions}/></div>}
            <div className="note"><UtensilsCrossed size={18}/><span>Ингредиенты пересчитаны на {servings} {pluralPeople(servings)}. Количество можно изменить в любой момент.</span></div>
          </section>
        </div>
      )}

      <nav className="bottomNav" aria-label="Основная навигация">
        <button className={!showFinder && tab === 'home' && !selected ? 'navItem active' : 'navItem'} onClick={goHome} aria-current={!showFinder && tab === 'home' && !selected ? 'page' : undefined}>
          <Home size={20} /><span>Главная</span>
        </button>
        <button className={!showFinder && tab === 'recipes' ? 'navItem active' : 'navItem'} onClick={goRecipes} aria-current={!showFinder && tab === 'recipes' ? 'page' : undefined}>
          <Utensils size={20} /><span>Рецепты</span>
        </button>
        <button className={showFinder ? 'navItem active' : 'navItem'} onClick={() => setShowFinder(true)} aria-current={showFinder ? 'page' : undefined}>
          <ChefHat size={20} /><span>Из продуктов</span>
        </button>
        <button className={!showFinder && tab === 'favorites' ? 'navItem active' : 'navItem'} onClick={goFavorites} aria-current={!showFinder && tab === 'favorites' ? 'page' : undefined}>
          <Heart size={20} fill={tab === 'favorites' ? 'currentColor' : 'none'} /><span>Избранное</span>
        </button>
        <button className={!showFinder && tab === 'kitchen' ? 'navItem active' : 'navItem'} onClick={goKitchen} aria-current={!showFinder && tab === 'kitchen' ? 'page' : undefined}>
          <UserRound size={20} /><span>Моя кухня</span>
        </button>
      </nav>

      {showFinder && <IngredientFinder recipes={recipes} onClose={() => setShowFinder(false)} onSelectRecipe={selectFinderRecipe} />}
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
