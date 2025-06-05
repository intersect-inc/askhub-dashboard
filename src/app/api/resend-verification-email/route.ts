import { AxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { NextResponse } from 'next/server'

import { resendVerificationEmail } from '@/lib/auth0'
import { auth } from '@/lib/next-auth'

import { ResendVerificationEmailApiError } from './type'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const session = await auth()
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { data: ResendVerificationEmailApiError.INVALID_SESSION },
        { status: 401 }
      )
    }

    if (session.emailVerified) {
      return NextResponse.json(
        { data: ResendVerificationEmailApiError.EMAIL_ALREADY_VERIFIED },
        { status: 422 }
      )
    }

    const decoded = jwtDecode(session.accessToken)
    if (!decoded?.sub) {
      return NextResponse.json(
        { data: ResendVerificationEmailApiError.INVALID_SUB },
        { status: 400 }
      )
    }

    await resendVerificationEmail(decoded.sub)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        {
          data:
            error.response?.data?.data?.errorCode == 'inexistent_user'
              ? ResendVerificationEmailApiError.INEXISTENT_USER
              : ResendVerificationEmailApiError.INTERNAL_SERVER_ERROR,
        },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        { data: ResendVerificationEmailApiError.INTERNAL_SERVER_ERROR },
        { status: 500 }
      )
    }
  }
}
