'use client'

import useSWR, { mutate, SWRConfiguration } from 'swr'
import { cache } from 'swr/_internal'
import useSWRImmutable from 'swr/immutable'

import { getMe, KEY, Me } from '../api/getMe'

export const useMe = (options?: SWRConfiguration<Me>) =>
  useSWR(KEY(), getMe, options)

export const useMeImmutable = (options?: SWRConfiguration<Me>) =>
  useSWRImmutable(KEY(), getMe, options)
export const refreshMe = async () => await mutate(KEY())

export const me = () => cache.get(KEY())?.data as Me | undefined
