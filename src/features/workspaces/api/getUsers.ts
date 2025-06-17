import useSWR from 'swr'
import { z } from 'zod'

import { client } from '@/lib/api'

const UserSchema = z.object({
  workspaceMemberUuid: z.string(),
  workspaceUuid: z.string(),
  displayName: z.string(),
  email: z.string(),
})

const GetUsersResponseSchema = z.object({
  members: z.array(UserSchema),
})

export type User = z.infer<typeof UserSchema>
export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>

export const useUsers = () => {
  const { data, error, isLoading } = useSWR<GetUsersResponse>(
    '/admin/users',
    async (url: string) => {
      const response = await client.get<GetUsersResponse>(url)
      return GetUsersResponseSchema.parse(response.data)
    }
  )

  return {
    data,
    isLoading,
    error,
  }
}
