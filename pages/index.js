import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

const DEFAULT_ACTIVE_COLOR = '#FF6B4A';
const INACTIVE_COLOR = '#555555';

export default function Home() {
  const canvasRef = useRef(null);
  const [goalInput, setGoalInput] = useState('No sugar');
  const [colorInput, setColorInput] = useState(DEFAULT_ACTIVE_COLOR);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [modelSelect, setModelSelect] = useState('1170x2532');
  const [shareUrl, setShareUrl] = useState('');
  const [directMode, setDirectMode] = useState(false);

  // Инициализация дат и парсинг URL параметров
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 2);

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const isDirect = searchParams.get('direct') === 'true';
      
      // Установим значения из URL или по умолчанию
      setGoalInput(searchParams.get('goal') || 'No sugar');
      setStartInput(searchParams.get('start_date') || today);
      setEndInput(searchParams.get('goal_date') || nextMonth.toISOString().split('T')[0]);
      setColorInput(searchParams.get('color') || DEFAULT_ACTIVE_COLOR);
      setModelSelect(searchParams.get('res') || '1170x2532');
      setDirectMode(isDirect);
    } else {
      setStartInput(today);
      setEndInput(nextMonth.toISOString().split('T')[0]);
    }
  }, []);

  // Рисование обоев
  const drawWallpaper = (
    goal = goalInput,
    start = startInput,
    end = endInput,
    color = colorInput,
    res = modelSelect
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const [width, height] = res.split('x').map(Number);

    canvas.width = width;
    canvas.height = height;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const totalDays = Math.max(
      1,
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    );
    let passedDays = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
    passedDays = Math.max(0, Math.min(totalDays, passedDays));
    const daysLeft = totalDays - passedDays;
    const percent = Math.round((passedDays / totalDays) * 100);

    // Рисование фона
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Рисование точек
    const cols = 11;
    const spacing = width * 0.07;
    const radius = width * 0.018;
    const rows = Math.ceil(totalDays / cols);
    const gridHeight = (rows - 1) * spacing;
    const startX = (width - (cols - 1) * spacing) / 2;
    const startY = (height - gridHeight) / 2;

    for (let i = 0; i < totalDays; i++) {
      ctx.beginPath();
      ctx.arc(
        startX + ((i % cols) * spacing),
        startY + (Math.floor(i / cols) * spacing),
        radius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = i < passedDays ? color : INACTIVE_COLOR;
      ctx.fill();
    }

    // Название цели
    ctx.textAlign = 'center';
    ctx.fillStyle = INACTIVE_COLOR;
    ctx.font = `400 ${width * 0.045}px -apple-system, sans-serif`;
    ctx.fillText(goal, width / 2, startY - spacing * 1.5);

    // Статистика
    const statsY = startY + gridHeight + spacing * 1.5;
    const leftText = `${daysLeft}d left`;
    const pText = ` · ${percent}%`;
    ctx.font = `600 ${width * 0.04}px -apple-system, sans-serif`;
    const tw =
      ctx.measureText(leftText).width + ctx.measureText(pText).width;
    ctx.textAlign = 'left';
    ctx.fillStyle = color;
    ctx.fillText(leftText, (width - tw) / 2, statsY);
    ctx.fillStyle = INACTIVE_COLOR;
    ctx.fillText(
      pText,
      (width - tw) / 2 + ctx.measureText(leftText).width,
      statsY
    );

    // Генерирование ссылки
    const finalUrl = `${
      typeof window !== 'undefined' ? window.location.origin : ''
    }${typeof window !== 'undefined' ? window.location.pathname : ''}?goal=${encodeURIComponent(
      goal
    )}&start_date=${start}&goal_date=${end}&res=${res}&color=${encodeURIComponent(
      color
    )}&direct=true`;
    setShareUrl(finalUrl);
  };

  // Обновляем при изменении значений
  useEffect(() => {
    drawWallpaper();
  }, [goalInput, startInput, endInput, colorInput, modelSelect]);

  // Если direct mode, скачиваем после отрисовки
  useEffect(() => {
    if (directMode && canvasRef.current) {
      // Даём время на отрисовку
      const timer = setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'goal.png';
        link.href = canvasRef.current.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // После скачивания перенаправляем на главную страницу
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [directMode]);

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Скопировано!');
  };

  const downloadImg = () => {
    const link = document.createElement('a');
    link.download = 'goal.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <>
      <Head>
        <title>Goal Dots Wallpaper Generator</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-full p-6 md:p-12 lg:flex lg:gap-12 max-w-7xl mx-auto">
        <div className="lg:w-1/2 space-y-8">
          <header>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Генератор Целей
            </h1>
            <p className="text-[#888888] mt-2 text-lg">
              Создайте живые обои для экрана блокировки iPhone, которые
              отслеживают ваш прогресс.
            </p>
          </header>

          <div className="bg-[#111114] p-6 rounded-2xl border border-[#3A3A3C] space-y-5">
            <h2 className="text-xl font-bold mb-4">1. Настройка параметров</h2>

            <div>
              <label className="block text-xs text-[#888] uppercase font-semibold mb-2">
                Название цели
              </label>
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-full p-4 rounded-xl text-lg"
                placeholder="Напр: Марафон"
              />
            </div>

            <div>
              <label className="block text-xs text-[#888] uppercase font-semibold mb-2">
                Акцентный цвет
              </label>
              <div className="flex items-center bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl p-2">
                <input
                  type="color"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer mr-3"
                />
                <span className="text-[#888888] text-sm">
                  Выберите цвет активных точек
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#888] uppercase font-semibold mb-2">
                  Старт
                </label>
                <input
                  type="date"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  className="w-full p-4 rounded-xl text-center"
                />
              </div>
              <div>
                <label className="block text-xs text-[#888] uppercase font-semibold mb-2">
                  Финиш
                </label>
                <input
                  type="date"
                  value={endInput}
                  onChange={(e) => setEndInput(e.target.value)}
                  className="w-full p-4 rounded-xl text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#888] uppercase font-semibold mb-2">
                Модель iPhone
              </label>
              <select
                value={modelSelect}
                onChange={(e) => setModelSelect(e.target.value)}
                className="w-full p-4 rounded-xl text-lg appearance-none"
                style={{
                  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '24px',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="1170x2532">iPhone 13 / 14 / 15 / Pro</option>
                <option value="1290x2796">iPhone Pro Max / Plus</option>
                <option value="1125x2436">iPhone X / XS / 11 Pro</option>
                <option value="1080x2340">iPhone mini</option>
              </select>
            </div>
          </div>

          <div className="bg-[#111114] p-6 rounded-2xl border border-[#3A3A3C] space-y-5">
            <h2 className="text-xl font-bold mb-4">2. Настройка iPhone (Команды)</h2>
            <ol className="list-decimal list-inside space-y-3 text-[#CCCCCC]">
              <li>
                Откройте приложение <b>«Команды»</b> (Shortcuts).
              </li>
              <li>
                Вкладка «Автоматизация» → «Новая автоматизация».
              </li>
              <li>
                Выберите <b>«Время суток»</b> (например, 07:00), «Ежедневно»,{' '}
                <b>«Немедленный запуск»</b>.
              </li>
              <li>
                Добавьте действие <b>«Получить содержимое URL»</b> и вставьте
                ссылку ниже.
              </li>
              <li>
                Добавьте действие <b>«Установить фото обоев»</b> (выберите
                Экран блокировки, <b>отключите</b> "Показать превью").
              </li>
            </ol>

            <div className="mt-4">
              <label className="block text-xs text-[#888] uppercase font-semibold mb-2">
                Ваша уникальная ссылка для автоматизации:
              </label>
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  onClick={(e) => e.target.select()}
                  className="flex-1 bg-[#0A0A0D] p-4 rounded-xl text-xs font-mono border border-[#FF6B4A]/30 truncate"
                  style={{ color: colorInput }}
                />
                <button
                  onClick={copyUrl}
                  className="absolute right-2 top-2 bottom-2 text-black font-bold px-4 rounded-lg hover:bg-white transition flex items-center justify-center"
                  style={{ backgroundColor: colorInput }}
                >
                  Копировать
                </button>
              </div>
              <p className="text-[#888888] text-xs mt-2">
                Эту ссылку нужно вставить в действие "Получить содержимое URL".
              </p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 mt-12 lg:mt-0 sticky top-6 self-start">
          <h3 className="text-xl font-bold mb-4 lg:hidden">Превью</h3>
          <div className="relative rounded-[2.5rem] overflow-hidden border-[6px] border-[#1C1C1E] shadow-2xl mx-auto max-w-[400px]">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block bg-black"
            />
            <div className="absolute top-0 left-0 right-0 flex justify-between px-8 pt-4 text-white font-medium pointer-events-none">
              <span>9:41</span>
              <div className="flex gap-2 items-center">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.73 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                </svg>
              </div>
            </div>
            <div
              className="absolute top-24 left-0 right-0 text-center text-white/80 text-8xl font-thin tracking-tighter pointer-events-none"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              09:41
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={downloadImg}
              className="text-sm hover:text-white underline transition"
              style={{ color: colorInput }}
            >
              Скачать изображение вручную
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
