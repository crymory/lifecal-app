# lifecal-app — генератор календаря целей

Простой Next.js (JavaScript) проект для генерации .ics календарей по цели. Поддерживает шаринг через параметр `user`.

Локально:

```bash
cd /home/anc/Документы/lifecal-app
npm install
npm run dev
```

API:
- GET `/api/generate?title=...&startDate=YYYY-MM-DD&count=4&user=alice` — вернёт скачиваемый .ics

Deploy на Vercel:

1. Установите Vercel: `npm i -g vercel` или используйте `npx vercel`.
2. В папке проекта выполните `vercel` и следуйте подсказкам.
