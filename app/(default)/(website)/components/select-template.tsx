import { WebsiteData } from "@/app/types"
import { Card } from "./card"
import { TemplateType } from "@prisma/client"
import { CreateWebsiteDataType } from "@/schemas/create-website"
import { UpdateWebsiteDataType } from "@/schemas/update-website"

type SelectTemplateProps = {
  template: TemplateType,
  handleDataUpdateByKey: (key: keyof CreateWebsiteDataType | keyof UpdateWebsiteDataType, value: any) => void
}

export const SelectTemplate = ({ template, handleDataUpdateByKey }: SelectTemplateProps) => {
  return (
    <Card title="Select Website Template">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="basic-template"
            name="template"
            value={TemplateType.BASIC}
            checked={template === TemplateType.BASIC}
            onChange={() => handleDataUpdateByKey('template', TemplateType.BASIC)}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="basic-template" className="text-sm text-slate-600 dark:text-slate-300">
            Basic Template (Simple and clean design)
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="elite-template"
            name="template"
            value={TemplateType.ELITE}
            checked={template === TemplateType.ELITE}
            onChange={() => handleDataUpdateByKey('template', TemplateType.ELITE)}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="elite-template" className="text-sm text-slate-600 dark:text-slate-300">
            Elite Template (Premium design with beautiful UI)
          </label>
        </div>
      </div>
    </Card>
  )
} 