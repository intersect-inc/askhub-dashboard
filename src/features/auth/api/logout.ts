import { AxiosError } from 'axios'
import { signOut } from 'next-auth/react'
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation'

export const useLogout = (
  options?: SWRMutationConfiguration<void, AxiosError, string>
) => useSWRMutation('logout', () => signOut(), options)
