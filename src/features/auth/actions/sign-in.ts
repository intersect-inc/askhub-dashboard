'use server'

import { signIn } from '@/lib/next-auth'

export async function handleSignIn() {
  await signIn()
}
