import { ActivityType, Outcome } from '@prisma/client';
import { logActivity } from '@/app/actions';

export function ActivityLogForm({ accountId }: { accountId: string }) {
  return (
    <form action={logActivity} className="space-y-2 rounded border bg-white p-4">
      <input type="hidden" name="accountId" value={accountId} />
      <input className="w-full rounded border p-2" name="contactName" placeholder="Contact name" required />
      <input className="w-full rounded border p-2" name="persona" placeholder="Persona" />
      <select className="w-full rounded border p-2" name="type">
        {Object.values(ActivityType).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <select className="w-full rounded border p-2" name="outcome">
        {Object.values(Outcome).map((outcome) => (
          <option key={outcome} value={outcome}>
            {outcome}
          </option>
        ))}
      </select>
      <input className="w-full rounded border p-2" name="occurredAt" type="datetime-local" />
      <textarea className="w-full rounded border p-2" name="notes" placeholder="Notes" />
      <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white" type="submit">
        Log Activity
      </button>
    </form>
  );
}
