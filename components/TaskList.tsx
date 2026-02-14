import { TaskStatus } from '@prisma/client';
import { toggleTask } from '@/app/actions';

export function TaskList({
  tasks
}: {
  tasks: { id: string; title: string; dueDate: Date; status: TaskStatus }[];
}) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="rounded border bg-white p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className={task.status === TaskStatus.DONE ? 'line-through' : ''}>{task.title}</p>
              <p className="text-xs text-slate-500">Due: {task.dueDate.toISOString().slice(0, 10)}</p>
            </div>
            <form
              action={async () => {
                'use server';
                await toggleTask(
                  task.id,
                  task.status === TaskStatus.OPEN ? TaskStatus.DONE : TaskStatus.OPEN
                );
              }}
            >
              <button className="rounded border px-2 py-1 text-xs" type="submit">
                {task.status === TaskStatus.OPEN ? 'Mark done' : 'Re-open'}
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
