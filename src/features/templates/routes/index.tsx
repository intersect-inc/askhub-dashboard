'use client'

import { useDiscoverAssistantTemplates } from '../api/getDiscoverAssistantTemplates'
import { useTemplateAssistantSections } from '../api/getTemplateAssistantSections'
import { SectionTabVertical } from '../components/section-tab'
import { TemplateCard, TemplateCardLoader } from '../components/template-card'
import {
  useAssistantTemplateSectionHelpers,
  useDiscoverAssistantTemplatesKey,
} from '../hooks/useDiscoverAssistantTemplates'

export const TemplatesRoute = () => {
  const requestParams = useDiscoverAssistantTemplatesKey()
  const { data: templates, isLoading } =
    useDiscoverAssistantTemplates(requestParams)
  const { data: sectionsData } = useTemplateAssistantSections()
  const { selectedSectionName } =
    useAssistantTemplateSectionHelpers(sectionsData)

  const filteredTemplates = templates?.templates.filter((template) => {
    if (!selectedSectionName || selectedSectionName === '全て') return true
    return template.sectionName === selectedSectionName
  })

  return (
    <div className="flex size-full flex-col">
      <SectionTabVertical
        sections={{ sections: sectionsData?.sections || [] }}
      />
      {isLoading && (
        <div className="grid grid-cols-3 gap-4 p-8">
          <TemplateCardLoader />
          <TemplateCardLoader />
          <TemplateCardLoader />
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 p-8">
        {filteredTemplates?.map((template) => (
          <TemplateCard key={template.uuid} data={template} />
        ))}
      </div>
    </div>
  )
}
