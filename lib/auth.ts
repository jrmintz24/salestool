import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function requireUser() {
  const { userId } = auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? `${userId}@unknown.local`;

  await prisma.user.upsert({
    where: { id: userId },
    update: {
      email,
      name: clerkUser?.fullName ?? null
    },
    create: {
      id: userId,
      email,
      name: clerkUser?.fullName ?? null
    }
  });

  return userId;
}
