import { redirect } from 'next/navigation'

import { auth } from '@/lib/next-auth'
import { Path } from '@/lib/path'
import Image from 'next/image'

export default async function SetupLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (session?.accessToken && session?.emailVerified) {
    redirect(Path.workspaces())
  }

  return (
    <div className="grid h-dvh w-screen grid-cols-2 gap-2 bg-[#2520EF]">
      <section className="flex size-full flex-col gap-3 rounded-r-[56px] bg-bg-white-0 p-8">
        <Image src="/vectors/brand.svg" alt="brand" width={120} height={32} />
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="mx-auto w-full max-w-lg">{children}</div>
        </div>
        <small className="text-paragraph-sm text-text-sub-600">
          &copy; 2025 Intersect Inc.
        </small>
      </section>
      <section className="flex items-center justify-center p-9">
        <Image src="/images/cover.webp" alt="askhub" width={800} height={600} />
      </section>
    </div>
  )
}
