import { pretendardJp } from '@/styles/font/local-fonts'
import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Askhub Dashboard',
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
      </body>
    </html>
  )
}
