import { Stage } from '@prisma/client';

export function StageBadge({ stage }: { stage: Stage }) {
  return <span className="rounded bg-slate-200 px-2 py-1 text-xs">{stage.replace('_', ' ')}</span>;
}
