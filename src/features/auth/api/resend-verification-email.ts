import { ResendVerificationEmailApiError } from '@/app/api/resend-verification-email/type'
import axios, { AxiosError, AxiosResponse } from 'axios'
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation'

export const useResendVerificationEmail = (
  options?: SWRMutationConfiguration<
    AxiosResponse,
    AxiosError<ResendVerificationEmailApiError>,
    'resend-verification-email'
  >
) =>
  useSWRMutation(
    'resend-verification-email',
    (key) =>
      axios.post(`/api/auth/${key}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    options
  )
