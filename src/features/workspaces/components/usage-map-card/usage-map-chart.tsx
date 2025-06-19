import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { GetUsageMapResponse } from '../../api/getUsageMap'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  data: GetUsageMapResponse
}

export const UsageMapChart = (props: Props) => {
  const { data } = props

  const chartData = {
    labels:
      data?.workspaces[0]?.usageCounts.map((count) => count.rangeName) || [],
    datasets: [
      {
        data:
          data?.workspaces[0]?.usageCounts.map((count) => count.memberCount) ||
          [],
        backgroundColor: [
          '#D5E2FF',
          '#C0D5FF',
          '#97BAFF',
          '#6895FF',
          '#335CFF',
          '#3559E9',
        ],
        borderColor: [
          '#D5E2FF',
          '#C0D5FF',
          '#97BAFF',
          '#6895FF',
          '#335CFF',
          '#3559E9',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '使用状況',
      },
    },
  }

  return (
    <div style={{ width: '240px', height: '240px' }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}
