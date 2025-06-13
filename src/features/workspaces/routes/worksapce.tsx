import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { UsageMapCard } from '../components/usage-map-card'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  workspaceUuid: string
}

export const WorksapceRoute = (props: Props) => {
  const { workspaceUuid } = props

  return (
    <div className="min-h-0 flex-1">
      <div className="grid h-full grid-cols-2 gap-4 p-8">
        <div className="min-h-0">
          <UsageMapCard workspaceUuid={workspaceUuid} />
        </div>
        <div className="min-h-0 rounded-10 border border-gray-200 p-4">
          <p className="text-label-lg">ダウンロード</p>
        </div>
      </div>
    </div>
  )
}
