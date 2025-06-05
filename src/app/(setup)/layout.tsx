import { redirect } from 'next/navigation'

import { auth } from '@/lib/next-auth'
import { Path } from '@/lib/path'

export default async function SetupLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (session?.accessToken && session?.emailVerified) {
    redirect(Path.workspaces())
  }

  return <>{children}</>
}
