import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { computeAccountScore, isTaskOverdue } from '@/lib/scoring';
import { AccountCard } from '@/components/AccountCard';
import { TaskList } from '@/components/TaskList';

export default async function DashboardPage() {
  const userId = await requireUser();
  const [accounts, tasks] = await Promise.all([
    prisma.account.findMany({
      where: { userId },
      include: {
        activities: { orderBy: { occurredAt: 'desc' }, take: 1 },
        tasks: { where: { status: 'OPEN' }, orderBy: { dueDate: 'asc' }, take: 1 }
      }
    }),
    prisma.task.findMany({ where: { userId }, orderBy: { dueDate: 'asc' }, take: 10 })
  ]);

  const prioritized = accounts
    .map((account) => ({
      ...account,
      score: computeAccountScore({
        stage: account.stage,
        lastActivityAt: account.activities[0]?.occurredAt ?? null,
        hasOverdueTask: account.tasks.some(isTaskOverdue),
        tags: account.tags
      })
    }))
    .filter((a) => a.score > -100)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="mb-3 text-2xl font-bold">Top Accounts Today</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {prioritized.map((account) => (
            <AccountCard
              key={account.id}
              id={account.id}
              accountName={account.accountName}
              stage={account.stage}
              score={account.score}
              lastTouch={account.activities[0]?.occurredAt.toISOString().slice(0, 10) ?? 'No activity'}
              nextDue={account.tasks[0]?.dueDate.toISOString().slice(0, 10) ?? 'No task'}
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold">My Tasks Today</h2>
        <TaskList tasks={tasks} />
      </section>
    </div>
  );
}
