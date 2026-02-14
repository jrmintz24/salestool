import { NextResponse } from 'next/server';
import { ArtifactType } from '@prisma/client';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateMarkdown } from '@/lib/openai';
import { loadPrompt, promptWithInputs } from '@/lib/prompts';

export async function POST(request: Request) {
  const start = Date.now();
  const userId = await requireUser();

  const contentType = request.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());

  const accountId = String(payload.accountId || '');
  const account = await prisma.account.findFirst({ where: { id: accountId, userId } });
  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  const [systemPrompt, taskPrompt] = await Promise.all([loadPrompt('system.md'), loadPrompt('outreach_pack.md')]);

  const inputs = {
    accountName: account.accountName,
    persona: String(payload.persona || ''),
    productFocus: settings?.defaultProductFocus ?? 'BOTH',
    tone: settings?.defaultTone ?? 'Direct',
    triggerText: String(payload.triggerText || ''),
    personalizationNuggets: String(payload.personalizationNuggets || ''),
    signatureBlock: settings?.signatureBlock ?? '',
    defaultCTA: settings?.defaultCTA ?? '15–20 min call, Tue/Wed options'
  };

  const { text, model } = await generateMarkdown(`${systemPrompt}\n\n${promptWithInputs(taskPrompt, inputs)}`);

  const artifact = await prisma.aIArtifact.create({
    data: {
      userId,
      accountId: account.id,
      type: ArtifactType.OUTREACH_PACK,
      title: 'Outreach Pack',
      inputsJson: inputs,
      outputMarkdown: text,
      model
    }
  });

  await prisma.eventLog.create({
    data: {
      userId,
      eventType: 'artifact_generated',
      properties: { type: 'OUTREACH_PACK', model, latencyMs: Date.now() - start }
    }
  });

  if (contentType.includes('application/json')) {
    return NextResponse.json({ artifactId: artifact.id, markdown: artifact.outputMarkdown });
  }

  return NextResponse.redirect(new URL(`/accounts/${account.id}`, request.url));
}
