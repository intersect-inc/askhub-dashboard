import { z } from 'zod'

import { client } from '@/lib/api'

const Body = z.object({
  givenName: z.string(),
  familyName: z.string(),
  nickname: z.string(),
  name: z.string(),
  picture: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  sub: z.string(),
})

export type Body = z.infer<typeof Body>

const LoginResponse = z.object({
  success: z.boolean(),
})

type LoginResponse = z.infer<typeof LoginResponse>

export const login = async (body: Body): Promise<LoginResponse> => {
  Body.parse(body)

  const response = await client.post('/auth/login', body)
  return LoginResponse.parse(response?.data)
}
