export function OutreachPackForm({ accounts }: { accounts: { id: string; accountName: string }[] }) {
  return (
    <form action="/api/ai/outreach-pack" method="post" className="space-y-2 rounded border bg-white p-4">
      <select name="accountId" className="w-full rounded border p-2" required>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.accountName}
          </option>
        ))}
      </select>
      <input className="w-full rounded border p-2" name="persona" placeholder="Persona" required />
      <textarea className="w-full rounded border p-2" name="triggerText" placeholder="Paste trigger" />
      <textarea
        className="w-full rounded border p-2"
        name="personalizationNuggets"
        placeholder="Personalization nuggets"
      />
      <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white" type="submit">
        Generate Outreach Pack
      </button>
    </form>
  );
}
