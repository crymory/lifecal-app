"use client";

import React, { forwardRef } from "react";
import type { DotState, ProgressData } from "@/hooks/useProgress";

interface WallpaperPreviewProps {
    goalName: string;
    progress: ProgressData | null;
    width?: number;
    height?: number;
}

const DOT_COLORS: Record<DotState, string> = {
    passed: "#FFFFFF",
    today: "#FF5F2E",
    future: "#222222",
};

const WallpaperPreview = forwardRef<HTMLDivElement, WallpaperPreviewProps>(
    ({ goalName, progress, width = 390, height = 844 }, ref) => {
        const cols = 15;
        const dots = progress?.dots ?? [];
        const remainingDays = progress?.remainingDays ?? 0;
        const progressPercent = progress?.progressPercent ?? 0;

        const dotSize = Math.max(Math.round(width * 0.028), 4);
        const dotGap = Math.max(Math.round(width * 0.018), 2);

        return (
            <div
                ref={ref}
                style={{
                    width,
                    height,
                    backgroundColor: "#0A0A0A",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                }}
            >
                {/* Content block — starts at ~37% from top */}
                <div
                    style={{
                        position: "absolute",
                        top: `${Math.round(height * 0.37)}px`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: Math.round(width * 0.04),
                        width: "80%",
                    }}
                >
                    {/* Goal name */}
                    <p
                        style={{
                            color: "#999999",
                            fontSize: Math.max(Math.round(width * 0.035), 12),
                            fontWeight: 500,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            textAlign: "center",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                        }}
                    >
                        {goalName || "Your Goal"}
                    </p>

                    {/* Dot grid */}
                    {dots.length > 0 && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
                                gap: `${dotGap}px`,
                                justifyContent: "center",
                            }}
                        >
                            {dots.map((state, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: dotSize,
                                        height: dotSize,
                                        borderRadius: "50%",
                                        backgroundColor: DOT_COLORS[state],
                                        transition: "background-color 0.2s ease",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Stats */}
                    {progress && (
                        <p
                            style={{
                                color: "#666666",
                                fontSize: Math.max(Math.round(width * 0.03), 10),
                                fontWeight: 500,
                                letterSpacing: "0.02em",
                                textAlign: "center",
                                margin: 0,
                            }}
                        >
                            <span style={{ color: "#FF5F2E", fontWeight: 600 }}>
                                {remainingDays}
                            </span>
                            <span style={{ color: "#666666" }}>d left · </span>
                            <span style={{ color: "#666666" }}>{progressPercent}%</span>
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

WallpaperPreview.displayName = "WallpaperPreview";

export default WallpaperPreview;
