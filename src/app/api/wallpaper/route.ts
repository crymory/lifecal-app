import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { calculateProgress } from "@/hooks/useProgress";
import { getModelById } from "@/lib/iphone-models";
import type { DotState } from "@/hooks/useProgress";
import React from "react";

const DOT_COLORS: Record<DotState, string> = {
    passed: "#FFFFFF",
    today: "#FF5F2E",
    future: "#222222",
};

async function loadFont(): Promise<ArrayBuffer> {
    const res = await fetch(
        "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-500-normal.woff"
    );
    return res.arrayBuffer();
}

let fontCache: ArrayBuffer | null = null;

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const goal = searchParams.get("goal") || "My Goal";
    const startStr = searchParams.get("start") || "2026-01-01";
    const endStr = searchParams.get("end") || "2026-12-31";
    const modelStr = searchParams.get("model") || "iphone-16-pro-max";

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    const model = getModelById(modelStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json(
            { error: "Invalid date format" },
            { status: 400 }
        );
    }

    const progress = calculateProgress(startDate, endDate);
    const cols = 15;

    const { width, height } = model;
    const dotSize = Math.max(Math.round(width * 0.018), 6);
    const dotGap = Math.max(Math.round(width * 0.012), 3);

    if (!fontCache) {
        fontCache = await loadFont();
    }

    const element = React.createElement(
        "div",
        {
            style: {
                width: "100%",
                height: "100%",
                backgroundColor: "#0A0A0A",
                display: "flex",
                flexDirection: "column" as const,
                justifyContent: "flex-start",
                alignItems: "center",
                position: "relative" as const,
                fontFamily: "Inter",
            },
        },
        React.createElement(
            "div",
            {
                style: {
                    position: "absolute" as const,
                    top: `${Math.round(height * 0.37)}px`,
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    gap: Math.round(width * 0.04),
                    width: "80%",
                },
            },
            // Goal name
            React.createElement(
                "p",
                {
                    style: {
                        color: "#999999",
                        fontSize: Math.max(Math.round(width * 0.03), 14),
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase" as const,
                        textAlign: "center" as const,
                        margin: 0,
                    },
                },
                goal
            ),
            // Dot grid
            React.createElement(
                "div",
                {
                    style: {
                        display: "flex",
                        flexWrap: "wrap" as const,
                        gap: `${dotGap}px`,
                        justifyContent: "center",
                        maxWidth: `${cols * (dotSize + dotGap)}px`,
                    },
                },
                ...progress.dots.map((state: DotState, i: number) =>
                    React.createElement("div", {
                        key: i,
                        style: {
                            width: dotSize,
                            height: dotSize,
                            borderRadius: "50%",
                            backgroundColor: DOT_COLORS[state],
                        },
                    })
                )
            ),
            // Stats
            React.createElement(
                "div",
                {
                    style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: Math.max(Math.round(width * 0.025), 12),
                        fontWeight: 500,
                    },
                },
                React.createElement(
                    "span",
                    { style: { color: "#FF5F2E", fontWeight: 600 } },
                    `${progress.remainingDays}`
                ),
                React.createElement(
                    "span",
                    { style: { color: "#666666" } },
                    `d left · ${progress.progressPercent}%`
                )
            )
        )
    );

    const svg = await satori(element, {
        width,
        height,
        fonts: [
            {
                name: "Inter",
                data: fontCache,
                weight: 500,
                style: "normal",
            },
        ],
    });

    const resvg = new Resvg(svg, {
        fitTo: {
            mode: "width",
            value: width,
        },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new NextResponse(pngBuffer as unknown as BodyInit, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "no-cache, no-store, must-revalidate",
        },
    });
}
