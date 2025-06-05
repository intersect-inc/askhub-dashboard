'use client'

import * as LinkButton from '@/components/ui/link-button'
import { useToast } from '@/providers/toast'

import { useLogout } from '../api/logout'
import { useResendVerificationEmail } from '../api/resend-verification-email'

type Props = {
  className?: string
}

export const ResendVerifyMailLink = ({ className }: Props) => {
  const { setInlineToast } = useToast()
  const { trigger: triggerLogout, isMutating: isLogoutMutating } = useLogout()
  const { trigger, isMutating } = useResendVerificationEmail({
    onSuccess: () => {
      setInlineToast({
        text: '認証メールを再送しました',
        status: 'success',
      })
    },
    onError: (error) => {
      if (error.response?.data == 'INEXISTENT_USER') {
        triggerLogout()
        setInlineToast({
          text: 'ユーザー情報が見つかりませんでした',
          status: 'error',
        })
        setInlineToast({
          text: '再度ログインしてください',
          status: 'error',
        })
        return
      } else if (error.response?.data == 'EMAIL_ALREADY_VERIFIED') {
        setInlineToast({
          text: 'すでに認証済みのユーザーです',
          status: 'error',
        })
        return
      }

      setInlineToast({
        text: '認証メールの再送信に失敗しました',
        status: 'error',
      })
    },
  })

  if (isLogoutMutating) {
    return (
      <LinkButton.Root
        variant="primary"
        size="medium"
        className={className}
        disabled={isLogoutMutating}
      >
        ログアウト中です
      </LinkButton.Root>
    )
  }

  return (
    <LinkButton.Root
      variant="primary"
      size="medium"
      className={className}
      onClick={trigger}
      disabled={isMutating}
    >
      {isMutating ? '認証メールを再送しています' : '認証メールを再送する'}
    </LinkButton.Root>
  )
}
