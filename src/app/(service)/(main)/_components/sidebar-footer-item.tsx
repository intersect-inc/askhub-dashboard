'use client'

import { useSidebar } from '@/components/elements/siderbar'
import { LogoutButton } from '@/features/auth/routes/components/logout-button'
import { useMe } from '@/features/user/hooks/useMe'
import { cn } from '@/utils/cn'

export const SidebarFooterItem = () => {
  const { data: me } = useMe()
  const { collapsed } = useSidebar()
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 py-3 transition-all duration-300'
      )}
    >
      {!collapsed && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 transition-all duration-300',
            collapsed
              ? 'hidden w-0 overflow-hidden opacity-0'
              : 'w-auto opacity-100'
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              me?.currentWorkspaceMember.icon ?? '/images/no-image-avatar.png'
            }
            alt="avatar"
            width={40}
            height={40}
            className="shrink-0 rounded-full"
          />
          <div>
            <p className="text-label-sm text-text-sub-600">
              {me?.currentWorkspaceMember.name}
            </p>
            <p className="text-paragraph-xs text-text-sub-600">
              {me?.user.email}
            </p>
          </div>
        </div>
      )}
      <LogoutButton />
    </div>
  )
}
