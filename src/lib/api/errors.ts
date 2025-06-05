import { AxiosError } from 'axios'

export class BackendApiError<T> extends AxiosError<{
  detail: T
}> {}

export const isBackendApiError = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
): error is BackendApiError<T> => {
  return error instanceof AxiosError && error.response?.data?.detail
}
