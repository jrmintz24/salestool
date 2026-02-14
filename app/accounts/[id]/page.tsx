import { notFound } from 'next/navigation';
import { ArtifactViewer } from '@/components/ArtifactViewer';
import { ActivityLogForm } from '@/components/ActivityLogForm';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export default async function AccountDetailPage({ params }: { params: { id: string } }) {
  const userId = await requireUser();
  const account = await prisma.account.findFirst({
    where: { id: params.id, userId },
    include: {
      artifacts: { orderBy: { createdAt: 'desc' } },
      activities: { orderBy: { occurredAt: 'desc' } },
      contacts: true
    }
  });

  if (!account) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{account.accountName}</h1>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded border bg-white p-4">
          <h2 className="mb-2 font-semibold">Overview</h2>
          <p>Stage: {account.stage}</p>
          <p>Industry: {account.industry ?? 'N/A'}</p>
          <p>Initiatives: {account.initiatives ?? 'N/A'}</p>
        </div>
        <ActivityLogForm accountId={account.id} />
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold">Briefs / Outreach / Follow-up Artifacts</h2>
        <div className="space-y-3">
          {account.artifacts.map((artifact) => (
            <div key={artifact.id}>
              <h3 className="mb-1 font-medium">{artifact.title}</h3>
              <ArtifactViewer markdown={artifact.outputMarkdown} />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold">Activity log</h2>
        <ul className="space-y-2">
          {account.activities.map((activity) => (
            <li key={activity.id} className="rounded border bg-white p-3 text-sm">
              {activity.occurredAt.toISOString().slice(0, 10)} · {activity.type} · {activity.outcome} ·{' '}
              {activity.contactName}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
