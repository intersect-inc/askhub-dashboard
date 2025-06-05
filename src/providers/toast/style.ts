// eslint-disable-next-line import/no-extraneous-dependencies
import { KeyValuePair, ResolvableTo } from 'tailwindcss/types/config'

export const ANIMATION_TIME_MS = 350 as const
export const TRANSITION_DURATION = `duration-[${ANIMATION_TIME_MS}ms]` as const
export const TIMING_FUNC = 'ease-in-out' as const

export const TOAST_KEYFRAMES = {
  inlineToastEnter: {
    '0%': {
      opacity: '0',
      marginTop: '0',
      padding: '0',
      height: '0',
      transform: 'translate(-60px, 60px)',
    },
    '100%': {
      opacity: '1',
      marginTop: '4px',
      padding: '8px 10px',
      height: 'auto',
      transform: 'translate(0, 0)',
    },
  },
  inlineToastLeave: {
    '0%': {
      opacity: '1',
      marginTop: '4px',
      padding: '8px 10px',
      height: 'auto',
      transform: 'translate(0, 0)',
    },
    '100%': {
      opacity: '0',
      marginTop: '0',
      height: '0',
      padding: '0',
      transform: 'translate(60px, -60px)',
    },
  },
} satisfies ResolvableTo<
  KeyValuePair<string, KeyValuePair<string, KeyValuePair<string, string>>>
>

export const TOAST_ANIMATION = {
  'inline-toast-enter': `inlineToastEnter ${ANIMATION_TIME_MS}ms ${TIMING_FUNC} forwards`,
  'inline-toast-leave': `inlineToastLeave ${ANIMATION_TIME_MS}ms ${TIMING_FUNC} forwards`,
} satisfies ResolvableTo<KeyValuePair<string, string>>
