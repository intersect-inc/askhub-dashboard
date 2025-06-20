'use client'

import { useState } from 'react'

import * as Button from '@/components/ui/button'
import * as Dropdown from '@/components/ui/dropdown'
import * as Input from '@/components/ui/input'
import * as Label from '@/components/ui/label'
import * as Modal from '@/components/ui/modal'
import { toast } from '@/components/ui/toast'
import * as AlertToast from '@/components/ui/toast-alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { RiArrowDownSLine, RiDownloadLine } from '@remixicon/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  DownloadReportRequest,
  downloadAiUsageReport,
  downloadAllReports,
  downloadAssistantUsageReport,
  downloadUsageLogsReport,
} from '../../api/downloadReports'

type Props = {
  workspaceUuid: string
  workspaceName: string
}

export const DownloadModal = (props: Props) => {
  const { workspaceUuid, workspaceName } = props
  const [open, setOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<
    'all' | 'ai_usage' | 'assistant_usage' | 'usage_logs'
  >('all')

  const downloadFormSchema = z.object({
    month: z.string().min(1, 'month is required'),
    reportType: z.enum(['all', 'ai_usage', 'assistant_usage', 'usage_logs']),
  })

  type FormValues = z.infer<typeof downloadFormSchema>

  const onSubmit = async (data: FormValues) => {
    setIsDownloading(true)
    try {
      const params: DownloadReportRequest = {
        workspace_uuid: workspaceUuid,
        month: data.month,
      }

      switch (data.reportType) {
        case 'all':
          await downloadAllReports(params, workspaceName)
          break
        case 'ai_usage':
          await downloadAiUsageReport(params, workspaceName)
          break
        case 'assistant_usage':
          await downloadAssistantUsageReport(params, workspaceName)
          break
        case 'usage_logs':
          await downloadUsageLogsReport(params, workspaceName)
          break
      }

      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="success"
            message="ダウンロードが完了しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
      setOpen(false)
    } catch (error) {
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="error"
            message="ダウンロードに失敗しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
    } finally {
      setIsDownloading(false)
    }
  }

  const formMethods = useForm<FormValues>({
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      reportType: 'all',
      month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = formMethods

  const reportTypeOptions = [
    { value: 'all', label: 'すべてのレポート (ZIP)' },
    { value: 'ai_usage', label: 'AI利用料レポート' },
    { value: 'assistant_usage', label: 'アシスタント使用量レポート' },
    { value: 'usage_logs', label: '使用ログレポート' },
  ] as const

  const handleReportTypeChange = (value: string) => {
    const reportType = value as
      | 'all'
      | 'ai_usage'
      | 'assistant_usage'
      | 'usage_logs'
    setSelectedReportType(reportType)
    setValue('reportType', reportType)
  }

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Dropdown.Item
          onSelect={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
        >
          <Dropdown.ItemIcon as={RiDownloadLine} />
          ダウンロード
        </Dropdown.Item>
      </Modal.Trigger>
      <Modal.Content className="max-w-[440px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <Modal.Title>レポートダウンロード</Modal.Title>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label.Root htmlFor="month">
                対象月
                <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input id="month" type="month" {...register('month')} />
                </Input.Wrapper>
              </Input.Root>
              {errors.month && (
                <p className="text-red-500">{errors.month.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label.Root>
                レポートタイプ
                <Label.Asterisk />
              </Label.Root>
              <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <Button.Root
                    variant="neutral"
                    mode="stroke"
                    size="small"
                    className="w-full justify-between"
                  >
                    {
                      reportTypeOptions.find(
                        (option) => option.value === selectedReportType
                      )?.label
                    }
                    <RiArrowDownSLine className="size-4" />
                  </Button.Root>
                </Dropdown.Trigger>
                <Dropdown.Content className="w-full" align="start">
                  {reportTypeOptions.map((option) => (
                    <Dropdown.Item
                      key={option.value}
                      onSelect={() => handleReportTypeChange(option.value)}
                    >
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Content>
              </Dropdown.Root>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button.Root
                variant="neutral"
                mode="stroke"
                size="small"
                className="w-full"
                disabled={isDownloading}
              >
                キャンセル
              </Button.Root>
            </Modal.Close>
            <Button.Root
              type="submit"
              size="small"
              className="w-full"
              disabled={isDownloading}
            >
              {isDownloading ? 'ダウンロード中...' : 'ダウンロード'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  )
}
