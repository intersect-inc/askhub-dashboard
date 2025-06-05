import localFont from 'next/font/local'

import { pretendardJpVar } from './variables'

export const pretendardJp = localFont({
  src: [
    {
      path: '../../../public/fonts/PretendardJP/Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/PretendardJP/Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard-jp' satisfies typeof pretendardJpVar,
  preload: true,
})
