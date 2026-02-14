import Link from 'next/link';
import { Stage } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { createAccount } from '@/app/actions';

export default async function AccountsPage({
  searchParams
}: {
  searchParams: { q?: string; stage?: Stage };
}) {
  const userId = await requireUser();
  const q = searchParams.q ?? '';

  const accounts = await prisma.account.findMany({
    where: {
      userId,
      AND: [
        q
          ? {
              OR: [{ accountName: { contains: q, mode: 'insensitive' } }, { tags: { has: q } }]
            }
          : {},
        searchParams.stage ? { stage: searchParams.stage } : {}
      ]
    },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Accounts</h1>
      <form className="flex gap-2" method="get">
        <input className="w-full rounded border p-2" name="q" placeholder="Search by account or tag" />
        <select className="rounded border p-2" name="stage" defaultValue="">
          <option value="">All stages</option>
          {Object.values(Stage).map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          Filter
        </button>
      </form>

      <form action={createAccount} className="grid gap-2 rounded border bg-white p-4 md:grid-cols-3">
        <input className="rounded border p-2" name="accountName" placeholder="Account name" required />
        <input className="rounded border p-2" name="domain" placeholder="Domain" />
        <input className="rounded border p-2" name="industry" placeholder="Industry" />
        <input className="rounded border p-2" name="region" placeholder="Region" />
        <input className="rounded border p-2" name="tags" placeholder="Tags (comma-separated)" />
        <select className="rounded border p-2" name="stage" defaultValue={Stage.PROSPECTING}>
          {Object.values(Stage).map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
        <button className="rounded bg-slate-900 px-4 py-2 text-white md:col-span-3" type="submit">
          Add Account
        </button>
      </form>

      <ul className="space-y-2">
        {accounts.map((account) => (
          <li key={account.id} className="rounded border bg-white p-3">
            <Link className="font-medium" href={`/accounts/${account.id}`}>
              {account.accountName}
            </Link>
            <p className="text-xs text-slate-500">{account.stage}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
