import { ProductFocus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export default async function SettingsPage() {
  const userId = await requireUser();
  const settings =
    (await prisma.userSettings.findUnique({ where: { userId } })) ??
    (await prisma.userSettings.create({
      data: {
        userId,
        signatureBlock: ''
      }
    }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form action="/api/settings" method="post" className="space-y-2 rounded border bg-white p-4">
        <input className="w-full rounded border p-2" name="defaultTone" defaultValue={settings.defaultTone} />
        <input className="w-full rounded border p-2" name="defaultCTA" defaultValue={settings.defaultCTA} />
        <select className="w-full rounded border p-2" name="defaultProductFocus" defaultValue={settings.defaultProductFocus}>
          {Object.values(ProductFocus).map((focus) => (
            <option key={focus} value={focus}>
              {focus}
            </option>
          ))}
        </select>
        <textarea
          className="w-full rounded border p-2"
          name="signatureBlock"
          defaultValue={settings.signatureBlock}
        />
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          Save Settings
        </button>
      </form>
    </div>
  );
}
