export const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export const AUTH0_ISSUER_DOMAIN = process.env.AUTH0_ISSUER_DOMAIN as string
export const AUTH0_ISSUER_BASE_URL = `https://${AUTH0_ISSUER_DOMAIN}` as const

export const AUTH0_AUDIENCE_DOMAIN = process.env.AUTH0_AUDIENCE_DOMAIN as string
export const AUTH0_AUDIENCE_BASE_URL =
  `https://${AUTH0_AUDIENCE_DOMAIN}` as const

export const AUTH0_AUDIENCE = `${AUTH0_AUDIENCE_BASE_URL}/api/v2/` as const

export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID as string
export const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET as string
export const AUTH0_MANAGEMENT_API_CLIENT_ID = process.env
  .AUTH0_MANAGEMENT_API_CLIENT_ID as string
export const AUTH0_MANAGEMENT_API_CLIENT_SECRET = process.env
  .AUTH0_MANAGEMENT_API_CLIENT_SECRET as string

export const NEXT_AUTH_SECRET = process.env.NEXT_AUTH_SECRET as string
