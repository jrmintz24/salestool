'use server';

import { ActivityType, Outcome, Stage, TaskSource, TaskStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function createAccount(formData: FormData) {
  const userId = await requireUser();
  await prisma.account.create({
    data: {
      userId,
      accountName: String(formData.get('accountName') || ''),
      domain: String(formData.get('domain') || '') || null,
      industry: String(formData.get('industry') || '') || null,
      region: String(formData.get('region') || '') || null,
      stage: (String(formData.get('stage') || 'PROSPECTING') as Stage) ?? Stage.PROSPECTING,
      tags: String(formData.get('tags') || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    }
  });

  await prisma.eventLog.create({ data: { userId, eventType: 'account_created', properties: {} } });
  revalidatePath('/accounts');
}

export async function toggleTask(taskId: string, status: TaskStatus) {
  const userId = await requireUser();
  await prisma.task.updateMany({ where: { id: taskId, userId }, data: { status } });

  if (status === TaskStatus.DONE) {
    await prisma.eventLog.create({
      data: { userId, eventType: 'task_completed', properties: { taskId } }
    });
  }

  revalidatePath('/dashboard');
}

export async function logActivity(formData: FormData) {
  const userId = await requireUser();
  const accountId = String(formData.get('accountId') || '');

  await prisma.activity.create({
    data: {
      userId,
      accountId,
      contactName: String(formData.get('contactName') || 'Unknown'),
      persona: String(formData.get('persona') || '') || null,
      type: String(formData.get('type') || 'EMAIL') as ActivityType,
      outcome: String(formData.get('outcome') || 'ENGAGED') as Outcome,
      occurredAt: new Date(String(formData.get('occurredAt') || new Date().toISOString())),
      notes: String(formData.get('notes') || '') || null
    }
  });

  await prisma.eventLog.create({ data: { userId, eventType: 'activity_logged', properties: { accountId } } });
  revalidatePath(`/accounts/${accountId}`);
}

export async function createManualTask(formData: FormData) {
  const userId = await requireUser();
  await prisma.task.create({
    data: {
      userId,
      accountId: String(formData.get('accountId') || '') || null,
      title: String(formData.get('title') || ''),
      dueDate: new Date(String(formData.get('dueDate') || new Date().toISOString())),
      source: TaskSource.MANUAL
    }
  });
  revalidatePath('/dashboard');
}
