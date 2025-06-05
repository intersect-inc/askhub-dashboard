'use client'

import { useMemo } from 'react'

import { client } from '@/lib/api'

type Props = {
  children: React.ReactNode
  token: string
}
export const InitClientSideProvider = ({ children, token }: Props) => {
  const setAuthorization = useMemo(() => {
    if (!token) return false
    client.setAuthorization(token)
    return true
  }, [token])

  return setAuthorization ? children : null
}
