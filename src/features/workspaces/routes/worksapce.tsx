import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { UsageMapCard } from '../components/usage-map-card'
import { WorkspaceInfoCard } from '../components/workspace-info-card'
import { WorkspaceMemberTable } from '../components/workspace-member-table'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  workspaceUuid: string
}

export const WorksapceRoute = (props: Props) => {
  const { workspaceUuid } = props

  return (
    <div className="min-h-0 flex-1">
      <div className="grid h-full grid-cols-2 gap-4 overflow-y-auto p-8">
        <div className="min-h-0">
          <WorkspaceInfoCard workspaceUuid={workspaceUuid} />
        </div>
        <div className="min-h-0">
          <UsageMapCard workspaceUuid={workspaceUuid} />
        </div>
        <WorkspaceMemberTable workspaceUuid={workspaceUuid} />
      </div>
    </div>
  )
}
