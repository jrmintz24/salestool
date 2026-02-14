import { NextResponse } from 'next/server';
import { TaskSource } from '@prisma/client';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const userId = await requireUser();
  const body = await request.json();

  const account = await prisma.account.findFirst({ where: { id: body.accountId, userId } });
  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  const today = new Date();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const tasks = await prisma.$transaction([
    prisma.task.create({
      data: {
        userId,
        accountId: account.id,
        title: 'Research + confirm 1 why-now trigger',
        dueDate: today,
        source: TaskSource.AI
      }
    }),
    prisma.task.create({
      data: {
        userId,
        accountId: account.id,
        title: 'Send outreach to Economic Buyer',
        dueDate: today,
        source: TaskSource.AI
      }
    }),
    prisma.task.create({
      data: {
        userId,
        accountId: account.id,
        title: 'Add 1 more stakeholder + follow-up plan',
        dueDate: tomorrow,
        source: TaskSource.AI
      }
    })
  ]);

  return NextResponse.json({ created: tasks.length });
}
