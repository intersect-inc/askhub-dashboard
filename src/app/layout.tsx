import { Toaster } from '@/components/ui/toast'
import { pretendardJp } from '@/styles/font/local-fonts'
import type { Metadata } from 'next'
import '../styles/globals.css'

const MetaTitle = () => {
  switch (process.env.NEXT_PUBLIC_APP_URL) {
    case 'https://app.askhub.jp':
      return 'Askhub管理画面'
    case 'https://app-stg1.askhub.jp':
      return 'Askhub管理画面[STG]'
    default:
      return 'Askhub管理画面[DEV]'
  }
}

export const metadata: Metadata = {
  title: MetaTitle(),
  icons: {
    icon: '/meta/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="jp">
      <body className={`${pretendardJp.variable} bg-bg-white-0 antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
