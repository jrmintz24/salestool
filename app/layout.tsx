import type { Metadata } from 'next';
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Pipeline Copilot',
  description: 'Hosted multi-device sales copilot'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="border-b bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
              <div className="flex gap-4 text-sm font-medium">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/accounts">Accounts</Link>
                <Link href="/generate/outreach">Outreach</Link>
                <Link href="/settings">Settings</Link>
              </div>
              <UserButton afterSignOutUrl="/sign-in" />
            </nav>
          </header>
          <main className="mx-auto max-w-6xl p-4">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
