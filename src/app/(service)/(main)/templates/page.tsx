import { PageHeader } from '@/components/elements/page-header'
import { TemplatesRoute } from '@/features/templates'
import { AddAssistantTemplateModal } from '@/features/templates/components/add-assistant-template-modal'
import { RiFileTextLine } from '@remixicon/react'

export default function TemplatesPage() {
  return (
    <div className="flex size-full flex-col">
      <PageHeader
        title="アシスタントテンプレート"
        description="Askhubのアシスタントテンプレートを確認・編集できます。"
        leftIcon={<RiFileTextLine />}
      >
        <AddAssistantTemplateModal />
      </PageHeader>
      <div className="min-h-0 flex-1">
        <TemplatesRoute />
      </div>
    </div>
  )
}
