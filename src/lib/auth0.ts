import axios from 'axios'
import { z } from 'zod'

import {
  AUTH0_AUDIENCE,
  AUTH0_AUDIENCE_BASE_URL,
  AUTH0_MANAGEMENT_API_CLIENT_ID,
  AUTH0_MANAGEMENT_API_CLIENT_SECRET,
} from '@/config/env'

type Auth0APIToken = string

export const getAuth0APIToken = async (): Promise<Auth0APIToken | null> => {
  const options = {
    method: 'POST',
    url: `${AUTH0_AUDIENCE_BASE_URL}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    data: `{"client_id":"${AUTH0_MANAGEMENT_API_CLIENT_ID}","client_secret":"${AUTH0_MANAGEMENT_API_CLIENT_SECRET}","audience":"${AUTH0_AUDIENCE}","grant_type":"client_credentials"}`,
  }

  try {
    const res = await axios.request(options)
    return res.data.access_token
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return null
  }
}

export const resendVerificationEmail = async (sub: string) => {
  const token = await getAuth0APIToken()
  if (!token) {
    throw new Error('Auth0 API token not found')
  }

  const data = {
    user_id: sub,
    client_id: AUTH0_MANAGEMENT_API_CLIENT_ID,
  }

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${AUTH0_AUDIENCE}jobs/verification-email`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
    data: data,
  }

  await axios.request(config)
}

const Auth0User = z.object({
  created_at: z.string(),
  email: z.string().email(),
  email_verified: z.boolean(),
  name: z.string(),
  nickname: z.string(),
  picture: z.string(),
  updated_at: z.string(),
  user_id: z.string(),
  last_ip: z.string(),
  last_login: z.string(),
  logins_count: z.number(),
})

export type Auth0User = z.infer<typeof Auth0User>

export const getAuth0UserByEmail = async (
  email: string
): Promise<Auth0User | null> => {
  const token = await getAuth0APIToken()
  if (!token) {
    return null
  }

  const options = {
    method: 'GET',
    url: `${AUTH0_AUDIENCE}users-by-email`,
    params: { email },
    headers: { authorization: `Bearer ${token}` },
  }

  try {
    const res = await axios.request(options)
    const users = Auth0User.array().parse(res.data)
    return users?.length ? users[0] : null
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return null
  }
}
