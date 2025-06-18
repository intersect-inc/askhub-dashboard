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
    <div className="flex-1 overflow-auto custom-scroll-bar">
      <div className="grid auto-rows-min gap-4 p-8 pt-0">
        <div>
          <WorkspaceInfoCard workspaceUuid={workspaceUuid} />
        </div>
        <div>
          <UsageMapCard workspaceUuid={workspaceUuid} />
        </div>
        <WorkspaceMemberTable workspaceUuid={workspaceUuid} />
      </div>
    </div>
  )
}
