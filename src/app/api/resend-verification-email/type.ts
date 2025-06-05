export const ResendVerificationEmailApiError = {
  INVALID_TOKEN: 'INVALID_TOKEN',
  INVALID_SESSION: 'INVALID_SESSION',
  INEXISTENT_USER: 'INEXISTENT_USER',
  INVALID_SUB: 'INVALID_SUB',
  EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const
export type ResendVerificationEmailApiError =
  (typeof ResendVerificationEmailApiError)[keyof typeof ResendVerificationEmailApiError]
