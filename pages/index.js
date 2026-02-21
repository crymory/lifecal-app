import { useState } from 'react'

export default function Home() {
  const [title, setTitle] = useState('Моя цель')
  const [startDate, setStartDate] = useState('')
  const [count, setCount] = useState(4)
  const [user, setUser] = useState('')

  async function generate(e) {
    e.preventDefault()
    const params = new URLSearchParams({ title, startDate, count: String(count), user })
    const url = '/api/generate?' + params.toString()
    const res = await fetch(url)
    if (!res.ok) {
      alert('Ошибка генерации')
      return
    }
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${(user||'calendar')}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <main style={{fontFamily:'Arial, sans-serif',padding:20,maxWidth:700,margin:'0 auto'}}>
      <h1>Генератор календаря целей</h1>
      <form onSubmit={generate} style={{display:'grid',gap:10}}>
        <label>
          Название цели
          <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%'}} />
        </label>
        <label>
          Дата начала
          <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{width:'100%'}} required />
        </label>
        <label>
          Количество недель (событий)
          <input type="number" min={1} value={count} onChange={e=>setCount(Number(e.target.value))} style={{width:120}} />
        </label>
        <label>
          Идентификатор пользователя (опционально, для шаринга)
          <input value={user} onChange={e=>setUser(e.target.value)} style={{width:'100%'}} />
        </label>
        <div style={{display:'flex',gap:10}}>
          <button type="submit">Скачать .ics</button>
          <a style={{alignSelf:'center'}} href={`/api/generate?${new URLSearchParams({title,startDate,count:String(count),user}).toString()}`} target="_blank" rel="noreferrer">Открыть в новой вкладке</a>
        </div>
      </form>
      <p style={{marginTop:20}}>Поделитесь ссылкой с другими: скопируйте URL с параметром <em>user</em>.</p>
    </main>
  )
}
