import { Card } from "./card"
import { PAGES_NAVIGATION } from "@/constants/website"
import { CreateWebsiteDataType, } from "@/schemas/create-website"
import { UpdateWebsiteDataType } from "@/schemas/update-website"

type SelectPagesProps = {
  pages: string[]
  handleDataUpdateByKey: (key: keyof CreateWebsiteDataType | keyof UpdateWebsiteDataType, value: any) => void
}

export const SelectPages = ({ pages, handleDataUpdateByKey }: SelectPagesProps) => {

  const handlePageToggle = (pageId: string) => {
    const pageInfo = PAGES_NAVIGATION[pageId as keyof typeof PAGES_NAVIGATION]
    if (pageInfo.isRequired) return

    const updatedPages = pages.includes(pageId)
      ? pages.filter(id => id !== pageId)
      : [...pages, pageId]

    handleDataUpdateByKey('pages', updatedPages)
  }

  return (
    <Card title="Select Website Pages">
      <div className="space-y-2">
        {Object.keys(PAGES_NAVIGATION).map(pagePath => {
          const pageInfo = PAGES_NAVIGATION[pagePath as keyof typeof PAGES_NAVIGATION]
          const { isRequired, label } = pageInfo

          return (
            <label
              key={pagePath}
              className={`flex items-center space-x-2 ${isRequired ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              <input
                type="checkbox"
                checked={pages.includes(pagePath) || isRequired}
                onChange={() => handlePageToggle(pagePath)}
                disabled={isRequired}
                className="form-checkbox"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {label}{isRequired && " (Required)"}
              </span>
            </label>
          )
        })}
      </div>
    </Card>
  )
} 