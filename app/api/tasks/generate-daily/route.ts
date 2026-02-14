import { NextResponse } from 'next/server';
import { TaskSource } from '@prisma/client';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const userId = await requireUser();
  const accounts = await prisma.account.findMany({ where: { userId }, take: 3, orderBy: { updatedAt: 'desc' } });
  const today = new Date();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const data = accounts.flatMap((account) => [
    {
      userId,
      accountId: account.id,
      title: `Research + confirm 1 why-now trigger for ${account.accountName}`,
      dueDate: today,
      source: TaskSource.AI
    },
    {
      userId,
      accountId: account.id,
      title: `Send outreach to security leader at ${account.accountName}`,
      dueDate: today,
      source: TaskSource.AI
    },
    {
      userId,
      accountId: account.id,
      title: `Add 1 more stakeholder + follow-up plan for ${account.accountName}`,
      dueDate: tomorrow,
      source: TaskSource.AI
    }
  ]);

  await prisma.task.createMany({ data });
  return NextResponse.json({ created: data.length });
}
