import useSWR from 'swr'
import { z } from 'zod'

import { client } from '@/lib/api'

const WorkspaceSchema = z.object({
  workspaceUuid: z.string(),
  name: z.string(),
})

const GetWorkspacesResponseSchema = z.object({
  workspaces: z.array(WorkspaceSchema),
})

export type Workspace = z.infer<typeof WorkspaceSchema>
export type GetWorkspacesResponse = z.infer<typeof GetWorkspacesResponseSchema>

export const useWorkspaces = () => {
  const { data, error, isLoading } = useSWR<GetWorkspacesResponse>(
    '/admin/workspaces',
    async (url: string) => {
      const response = await client.get<GetWorkspacesResponse>(url)
      return GetWorkspacesResponseSchema.parse(response.data)
    }
  )

  return {
    data,
    isLoading,
    error,
  }
}
