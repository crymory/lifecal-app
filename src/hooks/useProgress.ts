import { useMemo } from "react";
import {
  differenceInDays,
  startOfDay,
  isBefore,
  isAfter,
  isEqual,
} from "date-fns";

export type DotState = "passed" | "today" | "future";

export interface ProgressData {
  totalDays: number;
  passedDays: number;
  remainingDays: number;
  progressPercent: number;
  currentDayIndex: number;
  dots: DotState[];
}

export function calculateProgress(
  startDate: Date,
  endDate: Date,
  today?: Date
): ProgressData {
  const now = startOfDay(today ?? new Date());
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);

  const totalDays = Math.max(differenceInDays(end, start) + 1, 1);

  let passedDays = 0;
  let currentDayIndex = -1;

  if (isBefore(now, start)) {
    passedDays = 0;
    currentDayIndex = -1;
  } else if (isAfter(now, end)) {
    passedDays = totalDays;
    currentDayIndex = -1;
  } else {
    passedDays = differenceInDays(now, start);
    currentDayIndex = passedDays;
    // passedDays = days before today (not including today)
  }

  const remainingDays = Math.max(
    totalDays - passedDays - (currentDayIndex >= 0 ? 1 : 0),
    0
  );
  const progressPercent = Math.round((passedDays / totalDays) * 100);

  const dots: DotState[] = [];
  for (let i = 0; i < totalDays; i++) {
    if (i < passedDays) {
      dots.push("passed");
    } else if (i === currentDayIndex) {
      dots.push("today");
    } else {
      dots.push("future");
    }
  }

  return {
    totalDays,
    passedDays,
    remainingDays,
    progressPercent,
    currentDayIndex,
    dots,
  };
}

export function useProgress(
  startDate: Date | null,
  endDate: Date | null
): ProgressData | null {
  return useMemo(() => {
    if (!startDate || !endDate) return null;
    return calculateProgress(startDate, endDate);
  }, [startDate, endDate]);
}
