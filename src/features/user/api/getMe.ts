import { z } from 'zod'

import { client } from '@/lib/api'

const User = z.object({
  uuid: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
})

const Workspace = z.object({
  uuid: z.string(),
  name: z.string(),
  icon: z.string(),
  usageLimit: z.number(),
})

const WorkspaceMember = z.object({
  uuid: z.string(),
  name: z.string(),
  icon: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  title: z.string().nullable(),
  customInstructionIsValid: z.boolean(),
  introductionIsValid: z.boolean(),
  usageLimit: z.number(),
  usageByMonth: z.array(z.record(z.string(), z.any())),
  usageExceeded: z.boolean(),
})

export const Me = z.object({
  user: User,
  workspaceList: z.array(Workspace),
  currentWorkspace: Workspace,
  currentWorkspaceMember: WorkspaceMember,
})

export type Me = z.infer<typeof Me>

export const KEY = () => '/me'

export const getMe = async (): Promise<Me> => {
  const response = await client.get<Me>(KEY())
  return Me.parse(response?.data)
}

export const getMeWithAuth = async (token?: string): Promise<Me | null> => {
  try {
    if (!token) throw new Error('Failed to set authorization')
    const setted = client.setAuthorization(token)
    if (!setted) throw new Error('Failed to set authorization')
    const response = await client.get<Me>(KEY())
    return Me.parse(response?.data)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    return null
  }
}
