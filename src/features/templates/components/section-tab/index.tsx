import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal'
import { GetAssistantTemplateSectionsResponse } from '@/features/templates/api/getTemplateAssistantSections'
import {
  useAssistantTemplateSectionHelpers,
  useDiscoverAssistantTemplatesStore,
} from '../../hooks/useDiscoverAssistantTemplates'
import { SectionSettingModal } from '../section-setting-modal'

type SectionTabVerticalProps = {
  sections: GetAssistantTemplateSectionsResponse
}

export const SectionTabVertical = ({ sections }: SectionTabVerticalProps) => {
  const { menuItems, selectedSectionName } =
    useAssistantTemplateSectionHelpers(sections)
  const setActiveSection = useDiscoverAssistantTemplatesStore(
    (state) => state.setActiveSection
  )

  const handleValueChange = (value: string) => {
    const selectedItem = menuItems.find((item) => item.label === value)
    if (selectedItem) {
      setActiveSection(selectedItem.key)
    }
  }

  return (
    <div className="mt-1 w-full px-8">
      <TabMenuHorizontal.Root
        defaultValue={selectedSectionName}
        onValueChange={handleValueChange}
        className="relative"
      >
        <TabMenuHorizontal.List>
          {menuItems.map(({ label }) => (
            <TabMenuHorizontal.Trigger key={label} value={label}>
              {label}
            </TabMenuHorizontal.Trigger>
          ))}
        </TabMenuHorizontal.List>
        <SectionSettingModal />
      </TabMenuHorizontal.Root>
    </div>
  )
}
