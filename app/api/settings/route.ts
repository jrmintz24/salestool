import { NextResponse } from 'next/server';
import { ProductFocus } from '@prisma/client';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const userId = await requireUser();
  const formData = await request.formData();

  await prisma.userSettings.upsert({
    where: { userId },
    update: {
      defaultTone: String(formData.get('defaultTone') || 'Direct'),
      defaultCTA: String(formData.get('defaultCTA') || ''),
      defaultProductFocus: String(formData.get('defaultProductFocus') || 'BOTH') as ProductFocus,
      signatureBlock: String(formData.get('signatureBlock') || '')
    },
    create: {
      userId,
      defaultTone: String(formData.get('defaultTone') || 'Direct'),
      defaultCTA: String(formData.get('defaultCTA') || ''),
      defaultProductFocus: String(formData.get('defaultProductFocus') || 'BOTH') as ProductFocus,
      signatureBlock: String(formData.get('signatureBlock') || '')
    }
  });

  return NextResponse.redirect(new URL('/settings', request.url));
}
