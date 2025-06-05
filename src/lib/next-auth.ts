import NextAuth from 'next-auth'
import 'next-auth/jwt'
import Auth0Provider from 'next-auth/providers/auth0'

import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_ISSUER_BASE_URL,
  NEXT_AUTH_SECRET,
} from '../config/env'
import { login } from '../features/auth'

import { getAuth0UserByEmail } from './auth0'
import { Path } from './path'

import type { NextAuthConfig } from 'next-auth'

const authConfig = {
  secret: NEXT_AUTH_SECRET,
  providers: [
    Auth0Provider({
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      issuer: AUTH0_ISSUER_BASE_URL,
      authorization: {
        params: {
          audience: AUTH0_AUDIENCE,
          prompt: 'login',
        },
      },
    }),
  ],
  pages: {
    signIn: Path.signIn(),
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}${Path.workspaces()}`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    async signIn({ profile }: { profile?: any }) {
      try {
        const res = await login({
          givenName: profile?.given_name ?? '',
          familyName: profile?.family_name ?? '',
          nickname: profile?.nickname ?? '',
          name: profile?.name ?? '',
          picture: profile?.picture ?? '',
          email: profile?.email ?? '',
          emailVerified: profile?.email_verified ?? false,
          sub: profile?.sub ?? '',
        })

        return res.success
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        return false
      }
    },
    async jwt({ token, account, profile, trigger, session }: any) {
      if (account?.provider === 'auth0') {
        token.accessToken = account.access_token
        token.emailVerified = !!profile?.email_verified
      }
      if (trigger === 'update') {
        token.emailVerified = session?.emailVerified
      }

      if (!token.emailVerified) {
        try {
          if (token?.email) {
            const user = await getAuth0UserByEmail(token.email)
            if (user) {
              token.emailVerified = user.email_verified
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        }
      }

      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token?.accessToken
      session.emailVerified = token?.emailVerified
      return session
    },
  },
} satisfies NextAuthConfig

const { handlers, auth, signIn: _signIn, signOut } = NextAuth(authConfig)

const signIn = async <R extends boolean = true>(
  options?: Parameters<typeof _signIn>[1]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<R extends false ? any : never> => await _signIn('auth0', options)

const singUp = async <R extends boolean = true>(
  options?: Parameters<typeof _signIn>[1]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<R extends false ? any : never> =>
  await _signIn('auth0', options, {
    screen_hint: 'signup',
  })

export { auth, handlers, signIn, signOut, singUp }

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    emailVerified?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    emailVerified?: boolean
  }
}
