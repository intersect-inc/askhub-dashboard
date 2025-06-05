import { API_URL } from '@/config/env'

export const fetcher = async (url: RequestInfo, options?: RequestInit) =>
  await fetch(API_URL + url, options)
    .then(handleErrors)
    .then((res) => res)

const handleErrors = async (res: void | Response) => {
  // NOTE: AbortError が発生した場合のみ。res === void に成りうる
  if (!res) return
  if (res.ok) return res

  try {
    await res.json()
  } catch {
    throw new Error(res.statusText)
  }

  return res
}
