import { NextResponse } from 'next/server';
import { ArtifactType } from '@prisma/client';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateMarkdown } from '@/lib/openai';
import { loadPrompt, promptWithInputs } from '@/lib/prompts';

export async function POST(request: Request) {
  const start = Date.now();
  const userId = await requireUser();
  const body = await request.json();

  const account = await prisma.account.findFirst({ where: { id: body.accountId, userId } });
  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  const [systemPrompt, taskPrompt] = await Promise.all([loadPrompt('system.md'), loadPrompt('account_brief.md')]);

  const inputs = {
    accountName: account.accountName,
    industry: account.industry,
    knownTools: account.knownTools,
    initiatives: account.initiatives,
    notes: account.notes,
    tags: account.tags
  };

  const { text, model } = await generateMarkdown(`${systemPrompt}\n\n${promptWithInputs(taskPrompt, inputs)}`);

  const artifact = await prisma.aIArtifact.create({
    data: {
      userId,
      accountId: account.id,
      type: ArtifactType.ACCOUNT_BRIEF,
      title: 'Account Brief',
      inputsJson: inputs,
      outputMarkdown: text,
      model
    }
  });

  await prisma.eventLog.create({
    data: {
      userId,
      eventType: 'artifact_generated',
      properties: { type: 'ACCOUNT_BRIEF', model, latencyMs: Date.now() - start }
    }
  });

  return NextResponse.json({ artifactId: artifact.id, markdown: artifact.outputMarkdown });
}
