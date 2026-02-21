import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [goal, setGoal] = useState('');
  const [color, setColor] = useState('#FF6B4A');
  const [startYear, setStartYear] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [startDay, setStartDay] = useState('');
  const [endYear, setEndYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');
  const [model, setModel] = useState('1170x2532');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const generateUrl = () => {
    if (!goal || !startYear || !startMonth || !startDay || !endYear || !endMonth || !endDay) {
      alert('Please fill all fields');
      return;
    }

    const startDate = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
    const endDate = `${endYear}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;

    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/wallpaper?goal=${encodeURIComponent(
        goal
      )}&start_date=${startDate}&goal_date=${endDate}&res=${model}&color=${encodeURIComponent(
        color
      )}`;
      setShareUrl(url);
    }
  };

  const copyUrl = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Head>
        <title>Goal Dots Wallpaper</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-md mx-auto py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Goal Wallpaper</h1>
            <p className="text-xs text-[#888888]">
              iPhone lock screen wallpaper that tracks your goal progress
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4 mb-8">
            {/* Goal */}
            <div>
              <label className="block text-xs text-[#888888] uppercase font-semibold mb-2">
                Goal Name
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Marathon"
                maxLength={50}
                className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30"
              />
            </div>

            {/* Color and Model */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#888888] uppercase font-semibold mb-2">
                  Color
                </label>
                <div className="flex items-center gap-2 bg-[#1C1C1E] border border-white/10 rounded-lg p-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#888888] uppercase font-semibold mb-2">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-3 text-xs focus:outline-none focus:border-white/30"
                >
                  <option value="1170x2532">iPhone 13-15</option>
                  <option value="1290x2796">Pro Max / Plus</option>
                  <option value="1125x2436">X / XS / 11 Pro</option>
                  <option value="1080x2340">Mini</option>
                </select>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs text-[#888888] uppercase font-semibold mb-2">
                Start Date
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value.slice(0, 4))}
                  placeholder="Year"
                  maxLength="4"
                  className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/30"
                />
                <input
                  type="text"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value.slice(0, 2))}
                  placeholder="MM"
                  maxLength="2"
                  className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/30"
                />
                <input
                  type="text"
                  value={startDay}
                  onChange={(e) => setStartDay(e.target.value.slice(0, 2))}
                  placeholder="DD"
                  maxLength="2"
                  className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs text-[#888888] uppercase font-semibold mb-2">
                Deadline
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value.slice(0, 4))}
                  placeholder="Year"
                  maxLength="4"
                  className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/30"
                />
                <input
                  type="text"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value.slice(0, 2))}
                  placeholder="MM"
                  maxLength="2"
                  className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/30"
                />
                <input
                  type="text"
                  value={endDay}
                  onChange={(e) => setEndDay(e.target.value.slice(0, 2))}
                  placeholder="DD"
                  maxLength="2"
                  className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateUrl}
            className="w-full h-12 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-colors mb-6"
          >
            Generate Link
          </button>

          {/* URL Display */}
          {shareUrl && (
            <div className="bg-[#111114] border border-white/10 rounded-lg p-4 space-y-3">
              <div className="text-xs text-[#888888] uppercase font-semibold">Your Link</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  onClick={(e) => e.target.select()}
                  className="flex-1 bg-[#1C1C1E] border border-white/10 rounded px-3 py-2 text-xs font-mono truncate focus:outline-none"
                />
                <button
                  onClick={copyUrl}
                  className={`shrink-0 px-4 py-2 rounded font-semibold text-xs transition-colors ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-[#666666]">
                Copy this link to Shortcuts app or open in browser to generate wallpaper
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-12 space-y-4 text-xs text-[#888888]">
            <div>
              <p className="font-semibold text-white mb-1">For iPhone Automation:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Shortcuts app → Automation → New Automation</li>
                <li>Time of Day → 6:00 AM → Daily → Run Immediately</li>
                <li>Add: "Get Contents of URL" → paste your link</li>
                <li>Add: "Set Wallpaper Photo" → Lock Screen</li>
                <li>Disable "Crop to Subject" & "Show Preview"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
