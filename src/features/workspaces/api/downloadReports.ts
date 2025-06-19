import JSZip from 'jszip'
import { z } from 'zod'

import { client } from '@/lib/api'

// リクエストの型定義
export const DownloadReportRequest = z.object({
  workspace_uuid: z.string(),
  month: z.string(), // YYYY-MM形式
})

export type DownloadReportRequest = z.infer<typeof DownloadReportRequest>

// CSVデータを取得する関数（Blobとして）
const getCsvBlob = async (
  endpoint: string,
  params: DownloadReportRequest,
  filename: string
) => {
  try {
    const response = await client.get(endpoint, {
      params,
      responseType: 'blob',
    })
    return { blob: response.data, filename, success: true }
  } catch (error) {
    // データがない場合は空のCSVを作成
    const emptyBlob = new Blob(['データがありません\n'], {
      type: 'text/csv; charset=utf-8',
    })
    return { blob: emptyBlob, filename, success: false }
  }
}

// 単一のCSVファイルをダウンロードする関数
export const downloadSingleReport = async (
  endpoint: string,
  params: DownloadReportRequest,
  filename: string
) => {
  const { blob } = await getCsvBlob(endpoint, params, filename)
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// AIの利用料をダウンロード
export const downloadAiUsageReport = async (
  params: DownloadReportRequest,
  workspaceName: string
) => {
  const filename = `ai_usage_${workspaceName}_${params.month}.csv`
  return downloadSingleReport('admin/reports/ai-usage/csv', params, filename)
}

// アシスタント使用量をダウンロード
export const downloadAssistantUsageReport = async (
  params: DownloadReportRequest,
  workspaceName: string
) => {
  const filename = `assistant_usage_${workspaceName}_${params.month}.csv`
  return downloadSingleReport(
    'admin/reports/assistant-usage/csv',
    params,
    filename
  )
}

// 使用ログをダウンロード
export const downloadUsageLogsReport = async (
  params: DownloadReportRequest,
  workspaceName: string
) => {
  const filename = `usage_logs_${workspaceName}_${params.month}.csv`
  return downloadSingleReport('admin/reports/usage-logs/csv', params, filename)
}

// すべてのレポートを一括ダウンロード
export const downloadAllReports = async (
  params: DownloadReportRequest,
  workspaceName: string
) => {
  // 3つのCSVファイルを並行して取得
  const [aiUsageData, assistantUsageData, usageLogsData] = await Promise.all([
    getCsvBlob(
      'admin/reports/ai-usage/csv',
      params,
      `ai_usage_${workspaceName}_${params.month}.csv`
    ),
    getCsvBlob(
      'admin/reports/assistant-usage/csv',
      params,
      `assistant_usage_${workspaceName}_${params.month}.csv`
    ),
    getCsvBlob(
      'admin/reports/usage-logs/csv',
      params,
      `usage_logs_${workspaceName}_${params.month}.csv`
    ),
  ])

  // ZIPファイルを作成
  const zip = new JSZip()
  zip.file(aiUsageData.filename, aiUsageData.blob)
  zip.file(assistantUsageData.filename, assistantUsageData.blob)
  zip.file(usageLogsData.filename, usageLogsData.blob)

  // ZIPファイルを生成してダウンロード
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const zipFilename = `reports_${workspaceName}_${params.month}.zip`

  const url = window.URL.createObjectURL(zipBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = zipFilename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
