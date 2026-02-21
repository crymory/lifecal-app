function escapeText(s){
  return String(s).replace(/\\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')
}

function formatDateISO(d){
  // return in UTC basic format YYYYMMDDTHHMMSSZ
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth()+1).padStart(2,'0')
  const dd = String(d.getUTCDate()).padStart(2,'0')
  const hh = String(d.getUTCHours()).padStart(2,'0')
  const min = String(d.getUTCMinutes()).padStart(2,'0')
  const ss = String(d.getUTCSeconds()).padStart(2,'0')
  return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`
}

function buildICS({title, startDate, count, user}){
  const dtStart = new Date(startDate)
  const events = []
  for(let i=0;i<count;i++){
    const evDate = new Date(dtStart)
    evDate.setDate(dtStart.getDate() + i*7)
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2,8)}-${i}`
    const dtstamp = formatDateISO(new Date())
    const dtstart = formatDateISO(evDate)
    const summary = escapeText(title)
    events.push([
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstart}`,
      `SUMMARY:${summary}`,
      'END:VEVENT'
    ].join('\r\n'))
  }

  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//lifecal-app//RU'
  ].join('\r\n')

  const body = events.join('\r\n')
  const footer = '\r\nEND:VCALENDAR'
  return header + '\r\n' + body + footer
}

export default function handler(req, res){
  const q = req.method === 'GET' ? req.query : req.body
  const title = q.title || 'Цель'
  const startDate = q.startDate || q.date || new Date().toISOString().slice(0,10)
  const count = Math.max(1, Number(q.count)||1)
  const user = q.user || ''

  try{
    const ics = buildICS({title, startDate, count, user})
    res.setHeader('Content-Type','text/calendar; charset=utf-8')
    const filename = (user?`${user}`:'calendar') + '.ics'
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.status(200).send(ics)
  }catch(err){
    res.status(500).json({error: String(err)})
  }
}
