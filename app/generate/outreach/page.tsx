import { OutreachPackForm } from '@/components/OutreachPackForm';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export default async function GenerateOutreachPage() {
  const userId = await requireUser();
  const accounts = await prisma.account.findMany({ where: { userId }, select: { id: true, accountName: true } });

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Standalone Outreach Generator</h1>
      <OutreachPackForm accounts={accounts} />
    </div>
  );
}
