"use client";

import React, { useRef, useState, useMemo } from "react";
import { Calendar, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProgress } from "@/hooks/useProgress";
import { IPHONE_MODELS, getModelById } from "@/lib/iphone-models";
import WallpaperPreview from "@/components/WallpaperPreview";
import InstallDrawer from "@/components/InstallDrawer";

export default function HomePage() {
  const [goalName, setGoalName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modelId, setModelId] = useState("iphone-16-pro-max");

  const previewRef = useRef<HTMLDivElement>(null);

  const parsedStart = useMemo(
    () => (startDate ? new Date(startDate) : null),
    [startDate]
  );
  const parsedEnd = useMemo(
    () => (endDate ? new Date(endDate) : null),
    [endDate]
  );

  const progress = useProgress(parsedStart, parsedEnd);
  const model = getModelById(modelId);

  // Preview dimensions (fit within the viewport)
  const previewWidth = 320;
  const previewHeight = Math.round(previewWidth * (model.height / model.width));

  // API URL
  const apiUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    if (!goalName || !startDate || !endDate) return "";
    const base = window.location.origin;
    const params = new URLSearchParams({
      goal: goalName,
      start: startDate,
      end: endDate,
      model: modelId,
    });
    return `${base}/api/wallpaper?${params.toString()}`;
  }, [goalName, startDate, endDate, modelId]);

  return (
    <main className="min-h-screen bg-[#0A0A0D] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF5F2E]/10 px-4 py-1.5 text-sm text-[#FF5F2E] font-medium mb-4">
            <Target className="h-3.5 w-3.5" />
            Goal Tracker Wallpaper
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            lifecal
          </h1>
          <p className="mt-3 text-white/40 max-w-md mx-auto text-sm leading-relaxed">
            Generate a minimalist lock screen wallpaper that tracks your goal
            progress day by day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Form */}
          <div className="space-y-6">
            {/* Goal Name */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Goal Name
              </label>
              <Input
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. Learn Japanese"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 focus:border-[#FF5F2E]/50 focus:ring-[#FF5F2E]/20"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white/5 border-white/10 text-white h-11 focus:border-[#FF5F2E]/50 focus:ring-[#FF5F2E]/20 [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Deadline
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white/5 border-white/10 text-white h-11 focus:border-[#FF5F2E]/50 focus:ring-[#FF5F2E]/20 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* iPhone Model */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                iPhone Model
              </label>
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 focus:border-[#FF5F2E]/50 focus:ring-[#FF5F2E]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1D] border-white/10">
                  {IPHONE_MODELS.map((m) => (
                    <SelectItem
                      key={m.id}
                      value={m.id}
                      className="text-white focus:bg-white/10 focus:text-white"
                    >
                      {m.name}{" "}
                      <span className="text-white/30 ml-1">
                        {m.width}×{m.height}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats card */}
            {progress && (
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {progress.totalDays}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                    Total Days
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#FF5F2E]">
                    {progress.remainingDays}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                    Days Left
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {progress.progressPercent}%
                  </p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                    Complete
                  </p>
                </div>
              </div>
            )}

            {/* Action button */}
            <InstallDrawer apiUrl={apiUrl} />
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* iPhone frame */}
              <div
                className="rounded-[2.5rem] border-[3px] border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50"
                style={{ width: previewWidth + 6, height: previewHeight + 6 }}
              >
                <div ref={previewRef}>
                  <WallpaperPreview
                    goalName={goalName}
                    progress={progress}
                    width={previewWidth}
                    height={previewHeight}
                  />
                </div>
              </div>

              {/* Dynamic Island */}
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 bg-black rounded-full"
                style={{
                  width: Math.round(previewWidth * 0.3),
                  height: Math.round(previewWidth * 0.085),
                }}
              />
            </div>

            <p className="text-[11px] text-white/30 text-center">
              {model.name} · {model.width}×{model.height}px
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
