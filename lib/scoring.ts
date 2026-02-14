import { Stage, TaskStatus } from '@prisma/client';

const STAGE_POINTS: Record<Stage, number> = {
  PROSPECTING: 5,
  QUALIFICATION: 4,
  DISCOVERY: 3,
  POC: 2,
  BUSINESS_CASE: 2,
  CLOSED_WON: -999,
  CLOSED_LOST: -999
};

export function computeAccountScore(input: {
  stage: Stage;
  lastActivityAt: Date | null;
  hasOverdueTask: boolean;
  tags: string[];
}) {
  if (input.stage === Stage.CLOSED_LOST || input.stage === Stage.CLOSED_WON) {
    return -999;
  }

  let score = STAGE_POINTS[input.stage];
  const now = Date.now();

  if (input.lastActivityAt) {
    const days = (now - input.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24);
    if (days >= 7) score += 4;
    else if (days >= 3) score += 2;
    else if (days <= 2) score -= 3;
  } else {
    score += 4;
  }

  if (input.hasOverdueTask) {
    score += 3;
  }

  if (input.tags.some((tag) => tag.toLowerCase().includes('trigger'))) {
    score += 2;
  }

  return score;
}

export function isTaskOverdue(task: { status: TaskStatus; dueDate: Date }) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return task.status === TaskStatus.OPEN && task.dueDate < startOfToday;
}
