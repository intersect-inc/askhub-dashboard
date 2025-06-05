import axios from 'axios'

import { API_URL } from '@/config/env'

const defaultOptions = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}

const _client = axios.create(defaultOptions)

export const setAuthorization = (token?: string): boolean => {
  if (!token) return false
  _client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return true
}

const client = Object.assign(_client, { setAuthorization })
export default client
