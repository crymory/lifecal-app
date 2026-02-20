'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const getDeadlineDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 4);
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  };

  const deadlineDate = getDeadlineDate();

  const [formData, setFormData] = useState({
    name: '',
    startYear: new Date().getFullYear(),
    startMonth: new Date().getMonth() + 1,
    startDay: new Date().getDate(),
    deadlineYear: deadlineDate.year,
    deadlineMonth: deadlineDate.month,
    deadlineDay: deadlineDate.day,
    iPhoneModel: 'iPhone 13 / 13 Pro / 14 / 14 Pro',
  });

  const [loading, setLoading] = useState(false);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('Year') ||
        name.includes('Month') ||
        name.includes('Day')
        ? parseInt(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const startDate = `${formData.startYear}-${String(
        formData.startMonth
      ).padStart(2, '0')}-${String(formData.startDay).padStart(2, '0')}`;
      const deadline = `${formData.deadlineYear}-${String(
        formData.deadlineMonth
      ).padStart(2, '0')}-${String(formData.deadlineDay).padStart(2, '0')}`;

      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          startDate,
          deadline,
          iPhoneModel: formData.iPhoneModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create goal');
      }

      const goal = await response.json();
      setGoalId(goal.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarUrl = () => {
    if (!goalId) return '';

    const startDate = `${formData.startYear}-${String(
      formData.startMonth
    ).padStart(2, '0')}-${String(formData.startDay).padStart(2, '0')}`;
    const deadline = `${formData.deadlineYear}-${String(
      formData.deadlineMonth
    ).padStart(2, '0')}-${String(formData.deadlineDay).padStart(2, '0')}`;

    const params = new URLSearchParams({
      goal: formData.name,
      goal_date: deadline,
      start_date: startDate,
      height: '2532',
      width: '1170',
    });

    return `${window.location.origin}/api/calendar?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0d] to-[#1a1a1f] p-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Lifecal
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Create a beautiful goal calendar for your iPhone lock screen
        </p>

        <div className="bg-[#111114] border border-white/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Define your Goal
          </h2>

          {goalId ? (
            <div className="space-y-6">
              <div className="bg-green-500/20 border border-green-500/50 p-4 rounded">
                <p className="text-green-400 font-medium">✓ Goal created successfully!</p>
                <p className="text-gray-300 text-sm mt-1">Goal ID: {goalId}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-white font-semibold">Your calendar image URL:</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generateCalendarUrl()}
                    className="flex-1 bg-[#0A0A0D] border border-white/10 rounded px-3 py-2 text-white text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateCalendarUrl());
                    }}
                    className="px-4 py-2 bg-white text-black rounded font-medium hover:bg-gray-200"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded">
                <p className="text-yellow-400 text-sm font-medium">📱 iPhone Setup Instructions:</p>
                <ol className="text-yellow-300 text-sm mt-2 space-y-1">
                  <li>1. Copy the URL above</li>
                  <li>2. Open Shortcuts app → Automation → Time of Day → 6:00 AM</li>
                  <li>3. Add "Get Contents of URL" action and paste the URL</li>
                  <li>4. Add "Set Wallpaper Photo" action → Lock Screen</li>
                  <li>5. Disable "Crop to Subject" and "Show Preview"</li>
                </ol>
              </div>

              <Link href="/">
                <button className="w-full py-3 bg-white text-black rounded font-medium hover:bg-gray-200">
                  Create Another Goal
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Goal</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. No Sugar"
                  maxLength={100}
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Start Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="startYear"
                    min="2020"
                    max="2100"
                    value={formData.startYear}
                    onChange={handleInputChange}
                    placeholder="Year"
                    className="bg-[#0A0A0D] border border-white/10 rounded px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <input
                    type="number"
                    name="startMonth"
                    min="1"
                    max="12"
                    value={formData.startMonth}
                    onChange={handleInputChange}
                    placeholder="Month"
                    className="bg-[#0A0A0D] border border-white/10 rounded px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <input
                    type="number"
                    name="startDay"
                    min="1"
                    max="31"
                    value={formData.startDay}
                    onChange={handleInputChange}
                    placeholder="Day"
                    className="bg-[#0A0A0D] border border-white/10 rounded px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Deadline
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="deadlineYear"
                    min="2020"
                    max="2100"
                    value={formData.deadlineYear}
                    onChange={handleInputChange}
                    placeholder="Year"
                    className="bg-[#0A0A0D] border border-white/10 rounded px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <input
                    type="number"
                    name="deadlineMonth"
                    min="1"
                    max="12"
                    value={formData.deadlineMonth}
                    onChange={handleInputChange}
                    placeholder="Month"
                    className="bg-[#0A0A0D] border border-white/10 rounded px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <input
                    type="number"
                    name="deadlineDay"
                    min="1"
                    max="31"
                    value={formData.deadlineDay}
                    onChange={handleInputChange}
                    placeholder="Day"
                    className="bg-[#0A0A0D] border border-white/10 rounded px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  iPhone Model
                </label>
                <select
                  name="iPhoneModel"
                  value={formData.iPhoneModel}
                  onChange={handleInputChange}
                  className="w-full bg-[#0A0A0D] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option>iPhone 13 / 13 Pro / 14 / 14 Pro</option>
                  <option>iPhone 15 / 15 Pro</option>
                  <option>iPhone 16 / 16 Pro</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 p-3 rounded">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black rounded font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Generate Calendar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
