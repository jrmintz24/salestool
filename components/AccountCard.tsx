import Link from 'next/link';
import { Stage } from '@prisma/client';
import { StageBadge } from '@/components/StageBadge';

export function AccountCard({
  id,
  accountName,
  stage,
  score,
  lastTouch,
  nextDue
}: {
  id: string;
  accountName: string;
  stage: Stage;
  score: number;
  lastTouch: string;
  nextDue: string;
}) {
  return (
    <article className="rounded border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{accountName}</h3>
        <StageBadge stage={stage} />
      </div>
      <p className="text-sm text-slate-600">Priority score: {score}</p>
      <p className="text-xs text-slate-500">Last touch: {lastTouch}</p>
      <p className="mb-3 text-xs text-slate-500">Next step due: {nextDue}</p>
      <div className="flex gap-2 text-xs">
        <Link className="rounded bg-slate-900 px-2 py-1 text-white" href={`/accounts/${id}`}>
          Account Brief
        </Link>
        <Link className="rounded bg-slate-900 px-2 py-1 text-white" href={`/accounts/${id}`}>
          Outreach Pack
        </Link>
        <Link className="rounded bg-slate-900 px-2 py-1 text-white" href={`/accounts/${id}`}>
          Log Activity
        </Link>
      </div>
    </article>
  );
}
