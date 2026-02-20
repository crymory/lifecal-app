import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

interface Goal {
  id: string;
  name: string;
  startDate: string;
  deadline: string;
  iPhoneModel: string;
  createdAt: string;
}

const goalsFile = path.join(process.cwd(), 'data', 'goals.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(path.dirname(goalsFile), { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Read all goals
async function readGoals(): Promise<Goal[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(goalsFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write goals
async function writeGoals(goals: Goal[]) {
  await ensureDataDir();
  await fs.writeFile(goalsFile, JSON.stringify(goals, null, 2), 'utf-8');
}

// GET - Retrieve a specific goal by ID
export async function GET(request: NextRequest) {
  const goalId = request.nextUrl.searchParams.get('id');

  if (!goalId) {
    return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
  }

  const goals = await readGoals();
  const goal = goals.find((g) => g.id === goalId);

  if (!goal) {
    return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
  }

  return NextResponse.json(goal);
}

// POST - Create a new goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startDate, deadline, iPhoneModel } = body;

    if (!name || !startDate || !deadline || !iPhoneModel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newGoal: Goal = {
      id: uuidv4(),
      name,
      startDate,
      deadline,
      iPhoneModel,
      createdAt: new Date().toISOString(),
    };

    const goals = await readGoals();
    goals.push(newGoal);
    await writeGoals(goals);

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
