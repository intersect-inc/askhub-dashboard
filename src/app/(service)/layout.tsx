import { AuthenticateProvider } from '@/providers/authenticate'

export default function ServiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthenticateProvider>{children}</AuthenticateProvider>
}
