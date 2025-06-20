import JSZip from 'jszip'
import { z } from 'zod'

import { client } from '@/lib/api'

// リクエストの型定義
export const DownloadReportRequest = z.object({
  workspace_uuid: z.string(),
  start_date: z.string().optional(), // YYYY-MM-DD形式
  end_date: z.string().optional(), // YYYY-MM-DD形式
  month: z.string().optional(), // YYYY-MM形式 (後方互換性のため)
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

// ファイル名の日付部分を生成する関数
const getDateSuffix = (params: DownloadReportRequest): string => {
  if (params.month) {
    return params.month
  }
  const startDate = params.start_date?.replace(/-/g, '') || ''
  const endDate = params.end_date?.replace(/-/g, '') || ''
  return startDate && endDate
    ? `${startDate}_${endDate}`
    : new Date().toISOString().slice(0, 7).replace(/-/g, '')
}

// AIの利用料をダウンロード
export const downloadAiUsageReport = async (
  params: DownloadReportRequest,
  workspaceName: string
) => {
  const dateSuffix = getDateSuffix(params)
  const filename = `ai_usage_${workspaceName}_${dateSuffix}.csv`
  return downloadSingleReport('admin/reports/ai-usage/csv', params, filename)
}

// アシスタント使用量をダウンロード
export const downloadAssistantUsageReport = async (
  params: DownloadReportRequest,
  workspaceName: string
) => {
  const dateSuffix = getDateSuffix(params)
  const filename = `assistant_usage_${workspaceName}_${dateSuffix}.csv`
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
  const dateSuffix = getDateSuffix(params)
  const filename = `usage_logs_${workspaceName}_${dateSuffix}.csv`
  return downloadSingleReport('admin/reports/usage-logs/csv', params, filename)
}

// すべてのレポートを一括ダウンロード
export const downloadAllReports = async (
  params: DownloadReportRequest,
  workspaceName: string
) => {
  const dateSuffix = getDateSuffix(params)

  // 3つのCSVファイルを並行して取得
  const [aiUsageData, assistantUsageData, usageLogsData] = await Promise.all([
    getCsvBlob(
      'admin/reports/ai-usage/csv',
      params,
      `ai_usage_${workspaceName}_${dateSuffix}.csv`
    ),
    getCsvBlob(
      'admin/reports/assistant-usage/csv',
      params,
      `assistant_usage_${workspaceName}_${dateSuffix}.csv`
    ),
    getCsvBlob(
      'admin/reports/usage-logs/csv',
      params,
      `usage_logs_${workspaceName}_${dateSuffix}.csv`
    ),
  ])

  // ZIPファイルを作成
  const zip = new JSZip()
  zip.file(aiUsageData.filename, aiUsageData.blob)
  zip.file(assistantUsageData.filename, assistantUsageData.blob)
  zip.file(usageLogsData.filename, usageLogsData.blob)

  // ZIPファイルを生成してダウンロード
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const zipFilename = `reports_${workspaceName}_${dateSuffix}.zip`

  const url = window.URL.createObjectURL(zipBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = zipFilename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
