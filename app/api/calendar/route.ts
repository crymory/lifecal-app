import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from 'canvas';
import { differenceInDays, startOfDay, parseISO } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const goalName = request.nextUrl.searchParams.get('goal') || 'Goal';
    const goalDateStr = request.nextUrl.searchParams.get('goal_date');
    const startDateStr = request.nextUrl.searchParams.get('start_date');
    const heightStr = request.nextUrl.searchParams.get('height') || '2532';
    const widthStr = request.nextUrl.searchParams.get('width') || '1170';

    if (!goalDateStr || !startDateStr) {
      return NextResponse.json(
        { error: 'goal_date and start_date are required' },
        { status: 400 }
      );
    }

    const width = parseInt(widthStr);
    const height = parseInt(heightStr);
    const goalDate = parseISO(goalDateStr);
    const startDate = parseISO(startDateStr);

    // Calculate days
    const totalDays = differenceInDays(goalDate, startDate);
    const passedDays = differenceInDays(new Date(), startDate);
    const remainingDays = Math.max(0, totalDays - passedDays);

    // Create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0a0d');
    gradient.addColorStop(1, '#1a1a1f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Padding
    const padding = 40;
    const gridWidth = width - padding * 2;
    const gridHeight = height - padding * 2 - 100; // Reserve space for text

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(goalName, width / 2, padding + 60);

    // Dates and progress text
    ctx.font = '24px Arial';
    ctx.fillStyle = '#888888';
    const progressText = `Days passed: ${passedDays} / ${totalDays} (${remainingDays} remaining)`;
    ctx.fillText(progressText, width / 2, padding + 110);

    // Calculate grid layout
    const cellsPerRow = Math.ceil(Math.sqrt(totalDays));
    const cellSize = Math.min(
      gridWidth / cellsPerRow,
      gridHeight / cellsPerRow
    );
    const gridStartX = (width - cellSize * cellsPerRow) / 2;
    const gridStartY = padding + 150;

    // Draw calendar grid
    for (let i = 0; i < totalDays; i++) {
      const row = Math.floor(i / cellsPerRow);
      const col = i % cellsPerRow;
      const x = gridStartX + col * cellSize;
      const y = gridStartY + row * cellSize;

      // Draw cell background
      if (i < passedDays) {
        ctx.fillStyle = '#4CAF50'; // Green for completed
      } else {
        ctx.fillStyle = '#333333'; // Dark for pending
      }

      ctx.fillRect(x + 5, y + 5, cellSize - 10, cellSize - 10);

      // Draw border
      ctx.strokeStyle = '#555555';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 5, y + 5, cellSize - 10, cellSize - 10);

      // Draw number
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(12, cellSize / 3)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), x + cellSize / 2, y + cellSize / 2);
    }

    // Set response headers
    const buffer = canvas.toBuffer('image/png');
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating calendar:', error);
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    );
  }
}
