'use server'

import { singUp } from '@/lib/next-auth'

export async function handleSignUp() {
  await singUp()
}
