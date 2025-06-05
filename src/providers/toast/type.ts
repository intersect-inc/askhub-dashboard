export type ToastStatus =
  | 'error'
  | 'warning'
  | 'success'
  | 'information'
  | 'feature'

export type InlineToastInput = {
  text: string
  status: ToastStatus
}

export type InlineToastType = {
  id: number
} & InlineToastInput
