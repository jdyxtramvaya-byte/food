import React, { useMemo, useState } from 'react'
import { Bot, Send, Sparkles, ChefHat, Refrigerator, LoaderCircle, ShieldCheck } from 'lucide-react'

const starters = [
  { label: 'Что приготовить?', prompt: 'Предложи несколько блюд из продуктов, которые есть дома.' },
  { label: 'Замена ингредиента', prompt: 'Помоги заменить ингредиент в рецепте и объясни пропорции.' },
  { label: 'Быстрый ужин', prompt: 'Предложи простой ужин, который можно приготовить максимум за 30 минут.' },
]

export default function AIChef({ pantry = '', recipes = [] }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [busy, setBusy] = useState(false)
  const endpoint = import.meta.env.VITE_AI_API_URL || ''
  const recipeNames = useMemo(() => recipes.slice(0, 80).map(recipe => recipe.name).filter(Boolean), [recipes])

  const sendMessage = async (value = message) => {
    const text = value.trim()
    if (!text || busy) return
    setMessage('')
    setMessages(current => [...current, { role: 'user', content: text }])
    if (!endpoint) {
      setMessages(current => [...current, {
        role: 'system',
        content: 'Интерфейс ИИ-шефа готов, но настоящий ИИ ещё не подключён. Для ответов нужна защищённая серверная функция и API-ключ модели. Ключ нельзя хранить в коде сайта. Следующим шагом подключим сервер, не меняя механизм запуска Food.'
      }])
      return
    }
    setBusy(true)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            pantry: pantry.split(/[,;\\n]+/).map(item => item.trim()).filter(Boolean).slice(0, 100),
            availableRecipes: recipeNames,
            language: 'ru',
          },
        }),
      })
      if (!response.ok) throw new Error('Сервер ответил с ошибкой (' + response.status + ').')
      const data = await response.json()
      const reply = typeof data.reply === 'string' ? data.reply.trim() : ''
      if (!reply) throw new Error('Сервер не вернул текстовый ответ.')
      setMessages(current => [...current, { role: 'assistant', content: reply }])
    } catch (error) {
      setMessages(current => [...current, {
        role: 'system',
        content: error instanceof Error ? error.message + ' Проверьте адрес серверной функции и её доступность.' : 'Не удалось связаться с ИИ-сервером.',
      }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="kitchenSection aiChefSection">
      <div className="kitchenSectionHead">
        <div><span>01 · УМНЫЙ ПОМОЩНИК</span><h3><Sparkles size={19}/> ИИ-шеф</h3></div>
        <span className="aiChefStatus"><span className={endpoint ? 'aiChefStatusDot connected' : 'aiChefStatusDot'}/>{endpoint ? 'Сервер задан' : 'Подключение впереди'}</span>
      </div>
      <div className="aiChefIntro">
        <div className="aiChefAvatar"><ChefHat size={23}/><Sparkles size={12}/></div>
        <div><strong>Что приготовим сегодня?</strong><p>Помощник сможет учитывать ваши запасы и рецепты Food, помогать с заменами и планированием.</p></div>
      </div>
      <div className="aiChefStarters">{starters.map(item => <button type="button" key={item.label} onClick={() => { setMessage(item.prompt) }}>{item.label}</button>)}</div>
      {messages.length > 0 && <div className="aiChefMessages" aria-live="polite">{messages.map((item, index) => <div className={'aiChefMessage ' + item.role} key={index}><span>{item.role === 'user' ? 'Вы' : item.role === 'assistant' ? 'ИИ-шеф' : 'Статус'}</span><p>{item.content}</p></div>)}{busy && <div className="aiChefTyping"><LoaderCircle size={15}/> ИИ готовит ответ…</div>}</div>}
      <form className="aiChefForm" onSubmit={event => { event.preventDefault(); sendMessage() }}>
        <textarea value={message} onChange={event => setMessage(event.target.value)} placeholder="Например: что приготовить из картошки, яиц и сыра?" rows={2} maxLength={1200}/>
        <button type="submit" disabled={!message.trim() || busy} aria-label="Отправить сообщение">{busy ? <LoaderCircle size={18}/> : <Send size={18}/>}</button>
      </form>
      <div className="aiChefPrivacy"><ShieldCheck size={14}/><span>API-ключ не хранится в браузере. Запасы отправляются только настроенному ИИ-серверу.</span></div>
      {!endpoint && <div className="aiChefSetup"><Bot size={17}/><span><strong>Первый этап:</strong> интерфейс подготовлен. Для настоящих ответов подключим защищённый API через серверную функцию — без ключей в открытом коде и без изменений запуска сайта.</span></div>}
    </section>
  )
}
