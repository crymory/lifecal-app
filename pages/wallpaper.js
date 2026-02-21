import { useEffect, useRef } from 'react';

export default function Wallpaper() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const goal = decodeURIComponent(params.get('goal') || 'Goal');
    const startDate = params.get('start_date') || '';
    const endDate = params.get('goal_date') || '';
    const userColor = params.get('color') || '#FF6B4A';
    const res_str = params.get('res') || '1170x2532';

    // Цвета
    const BG_COLOR = '#1a1a1a';
    const INACTIVE_COLOR = '#404040';
    const ACTIVE_COLOR = '#ffffff';
    const TEXT_COLOR = userColor;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const [width, height] = res_str.split('x').map(Number);

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.maxWidth = '400px';

    // Вычисляем дни
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
    ctx.fillStyle = BG_COLOR;
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
      ctx.fillStyle = i < passedDays ? ACTIVE_COLOR : INACTIVE_COLOR;
      ctx.fill();
    }

    // Название
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
    ctx.fillStyle = TEXT_COLOR;
    ctx.fillText(leftText, (width - tw) / 2, statsY);
    ctx.fillStyle = INACTIVE_COLOR;
    ctx.fillText(
      pText,
      (width - tw) / 2 + ctx.measureText(leftText).width,
      statsY
    );
  }, []);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
      padding: '20px'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          maxHeight: '100vh',
          display: 'block'
        }}
      />
    </div>
  );
}
