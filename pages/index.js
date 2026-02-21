import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

const DEFAULT_ACTIVE_COLOR = '#FF6B4A';
const INACTIVE_COLOR = '#555555';

export default function Home() {
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0);
  const [goalInput, setGoalInput] = useState('No sugar');
  const [colorInput, setColorInput] = useState(DEFAULT_ACTIVE_COLOR);
  const [startYear, setStartYear] = useState('2026');
  const [startMonth, setStartMonth] = useState('02');
  const [startDay, setStartDay] = useState('21');
  const [endYear, setEndYear] = useState('2026');
  const [endMonth, setEndMonth] = useState('04');
  const [endDay, setEndDay] = useState('21');
  const [modelSelect, setModelSelect] = useState('1170x2532');
  const [shareUrl, setShareUrl] = useState('');
  const [directMode, setDirectMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Инициализация дат и парсинг URL параметров
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const [y, m, d] = today.split('-');

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const isDirect = searchParams.get('direct') === 'true';

      setGoalInput(searchParams.get('goal') || 'No sugar');
      setStartYear(searchParams.get('start_date')?.split('-')[0] || y);
      setStartMonth(searchParams.get('start_date')?.split('-')[1] || m);
      setStartDay(searchParams.get('start_date')?.split('-')[2] || d);
      setEndYear(searchParams.get('goal_date')?.split('-')[0] || String(parseInt(y) + 1));
      setEndMonth(searchParams.get('goal_date')?.split('-')[1] || m);
      setEndDay(searchParams.get('goal_date')?.split('-')[2] || d);
      setColorInput(searchParams.get('color') || DEFAULT_ACTIVE_COLOR);
      setModelSelect(searchParams.get('res') || '1170x2532');
      setDirectMode(isDirect);
    }
  }, []);

  const startDate = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
  const endDate = `${endYear}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;

  // Рисование обоев
  const drawWallpaper = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const [width, height] = modelSelect.split('x').map(Number);

    canvas.width = width;
    canvas.height = height;

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    startDateObj.setHours(0, 0, 0, 0);
    endDateObj.setHours(0, 0, 0, 0);

    const totalDays = Math.max(
      1,
      Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1
    );
    let passedDays = Math.ceil((now - startDateObj) / (1000 * 60 * 60 * 24));
    passedDays = Math.max(0, Math.min(totalDays, passedDays));
    const daysLeft = Math.max(0, totalDays - passedDays);
    const percent = Math.round((passedDays / totalDays) * 100);

    // Фон
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Точки
    const cols = 11;
    const spacing = width * 0.07;
    const radius = width * 0.018;
    const rows = Math.ceil(totalDays / cols);
    const gridHeight = rows > 1 ? (rows - 1) * spacing : 0;
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
      ctx.fillStyle = i < passedDays ? colorInput : INACTIVE_COLOR;
      ctx.fill();
    }

    // Название
    ctx.textAlign = 'center';
    ctx.fillStyle = INACTIVE_COLOR;
    ctx.font = `400 ${width * 0.045}px -apple-system, sans-serif`;
    ctx.fillText(goalInput, width / 2, startY - spacing * 1.5);

    // Статистика
    const statsY = startY + gridHeight + spacing * 1.5;
    const leftText = `${daysLeft}d left`;
    const pText = ` · ${percent}%`;
    ctx.font = `600 ${width * 0.04}px -apple-system, sans-serif`;
    const tw =
      ctx.measureText(leftText).width + ctx.measureText(pText).width;
    ctx.textAlign = 'left';
    ctx.fillStyle = colorInput;
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
      goalInput
    )}&start_date=${startDate}&goal_date=${endDate}&res=${modelSelect}&color=${encodeURIComponent(
      colorInput
    )}&direct=true`;
    setShareUrl(finalUrl);
  };

  // Обновляем при изменении значений
  useEffect(() => {
    drawWallpaper();
  }, [goalInput, startDate, endDate, colorInput, modelSelect]);

  // Если direct mode, скачиваем после отрисовки
  useEffect(() => {
    if (directMode && canvasRef.current) {
      const timer = setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'goal.png';
        link.href = canvasRef.current.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [directMode]);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Goal Dots Wallpaper Generator</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Drawer-style container */}
          <div className="bg-[#0A0A0D] border-t border-white/10 rounded-t-2xl overflow-hidden">
            {/* Header */}
            <div className="border-b border-white/10 p-6">
              <h1 className="text-3xl font-bold">Installation Steps</h1>
              <p className="text-[#888888] mt-2 text-sm">
                First, define your wallpaper settings. Then create an automation to run daily. Finally, add the shortcut actions to update your lock screen.
              </p>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[80vh] p-6 space-y-8">
              {/* Step 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-lg font-semibold">Define your Wallpaper</h3>
                </div>

                <div className="ml-11 bg-[#111114] border border-white/10 rounded-lg p-6 space-y-6">
                  {/* Goal Input */}
                  <div>
                    <label className="block text-xs text-[#888888] uppercase font-semibold mb-3">
                      Goal
                    </label>
                    <input
                      type="text"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      placeholder="e.g. New York City Marathon"
                      maxLength={100}
                      className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  {/* Color and Model on same row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#888888] uppercase font-semibold mb-3">
                        Color
                      </label>
                      <div className="flex items-center gap-2 bg-[#1C1C1E] border border-white/10 rounded-lg p-2">
                        <input
                          type="color"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <span className="text-xs text-[#888888] flex-1">Active dots</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#888888] uppercase font-semibold mb-3">
                        iPhone Model
                      </label>
                      <select
                        value={modelSelect}
                        onChange={(e) => setModelSelect(e.target.value)}
                        className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                      >
                        <option value="1170x2532">iPhone 13 / 14 / 15 / Pro</option>
                        <option value="1290x2796">iPhone Pro Max / Plus</option>
                        <option value="1125x2436">iPhone X / XS / 11 Pro</option>
                        <option value="1080x2340">iPhone mini</option>
                      </select>
                    </div>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-xs text-[#888888] uppercase font-semibold mb-3">
                      Start Date
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value.slice(0, 4))}
                        placeholder="Year"
                        maxLength="4"
                        className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                      />
                      <input
                        type="text"
                        value={startMonth}
                        onChange={(e) => setStartMonth(e.target.value.slice(0, 2))}
                        placeholder="Month"
                        maxLength="2"
                        className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                      />
                      <input
                        type="text"
                        value={startDay}
                        onChange={(e) => setStartDay(e.target.value.slice(0, 2))}
                        placeholder="Day"
                        maxLength="2"
                        className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-xs text-[#888888] uppercase font-semibold mb-3">
                      Deadline
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value.slice(0, 4))}
                        placeholder="Year"
                        maxLength="4"
                        className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                      />
                      <input
                        type="text"
                        value={endMonth}
                        onChange={(e) => setEndMonth(e.target.value.slice(0, 2))}
                        placeholder="Month"
                        maxLength="2"
                        className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                      />
                      <input
                        type="text"
                        value={endDay}
                        onChange={(e) => setEndDay(e.target.value.slice(0, 2))}
                        placeholder="Day"
                        maxLength="2"
                        className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-lg font-semibold">Create Automation</h3>
                </div>
                <div className="ml-11 bg-[#111114] border border-white/10 rounded-lg p-4">
                  <p className="text-sm text-[#888888]">
                    Open <span className="text-white font-medium">Shortcuts</span> app → Go to{' '}
                    <span className="text-white font-medium">Automation</span> tab → New Automation →{' '}
                    <span className="text-white font-medium">Time of Day</span> →{' '}
                    <span className="text-white font-medium">6:00 AM</span> → Repeat{' '}
                    <span className="text-white font-medium">"Daily"</span> → Select{' '}
                    <span className="text-white font-medium">"Run Immediately"</span> →{' '}
                    <span className="text-white font-medium">"Create New Shortcut"</span>
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-lg font-semibold">Create Shortcut</h3>
                </div>

                <div className="ml-11 bg-[#111114] border border-white/10 rounded-lg p-4 space-y-4">
                  <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                    Add these actions:
                  </p>

                  {/* Action 3.1 */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-[#888888] text-sm shrink-0">3.1</span>
                      <div className="text-sm text-white flex-1">
                        <p>
                          <span className="font-medium">"Get Contents of URL"</span>
                          <span className="text-[#888888]"> → paste the following URL:</span>
                        </p>
                        <div className="flex gap-2 mt-2">
                          <div className="flex-1 bg-[#0A0A0D] border border-white/10 px-3 py-2 text-xs font-mono truncate text-[#888888] rounded">
                            {shareUrl}
                          </div>
                          <button
                            onClick={copyUrl}
                            className={`shrink-0 h-9 px-3 rounded font-medium text-xs transition-colors ${
                              copied ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-white/90'
                            }`}
                          >
                            {copied ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action 3.2 */}
                  <div className="flex gap-2">
                    <span className="text-[#888888] text-sm shrink-0">3.2</span>
                    <p className="text-sm text-white">
                      <span className="font-medium">"Set Wallpaper Photo"</span>
                      <span className="text-[#888888]"> → choose "Lock Screen"</span>
                    </p>
                  </div>

                  {/* Important note */}
                  <div className="bg-[#1A1508] border border-[#3D3000] rounded p-3 -mx-4 mt-4">
                    <p className="text-sm text-[#C4A000]">
                      <strong>Important:</strong> In "Set Wallpaper Photo", tap the arrow (→) to show options → disable both{' '}
                      <strong>"Crop to Subject"</strong> and <strong>"Show Preview"</strong>
                    </p>
                    <p className="text-xs text-[#8B7500] mt-2">
                      This prevents iOS from cropping and asking for confirmation each time
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preview</h3>
                <div className="flex justify-center">
                  <div className="relative rounded-2xl overflow-hidden border-4 border-[#1C1C1E] shadow-2xl w-48">
                    <canvas ref={canvasRef} className="w-full h-auto block bg-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="border-t border-white/10 p-4 flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 h-12 rounded-lg bg-transparent border border-white/10 text-[#888888] hover:text-white hover:border-white/30 font-medium transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = 'goal.png';
                  link.href = canvasRef.current.toDataURL();
                  link.click();
                }}
                className="flex-1 h-12 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
