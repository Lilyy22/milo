import { GeneratedContent } from "../../components/generated-content";
import { PAGES_NAVIGATION } from "@/constants/website";
import { UpdateWebsiteDataType } from "@/schemas/update-website";
import { useState } from "react";

type SecondStepProps = {
  formData: UpdateWebsiteDataType;
  generatedContent: Record<string, string>;
  setGeneratedContent: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  setCurrentStep: (step: number) => void;
};

export const SecondStep = ({
  formData,
  generatedContent,
  setGeneratedContent,
  setCurrentStep,
}: SecondStepProps) => {
  const [selectedPage, setSelectedPage] = useState<string>(
    formData.pages[0]?.replace("/", "") || "home"
  );
  const handlePageChange = (page: string) =>
    setSelectedPage(page.replace("/", ""));

  const selectedPageContent =
    selectedPage && generatedContent[selectedPage]
      ? { [selectedPage]: generatedContent[selectedPage] }
      : {};

  return (
    <>
      <div className="mb-6">
        <div className="mb-4 flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-3">
            2
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Website Pages Content
          </h2>
        </div>
        <div className="space-y-4 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center text-slate-700 dark:text-slate-200">
            <p>Content for the following pages:</p>
            {formData.pages.map((page) => (
              <span
                key={page}
                className="inline-block px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded ml-2 capitalize"
              >
                {PAGES_NAVIGATION[page as keyof typeof PAGES_NAVIGATION]
                  ?.label || page.replace("/", "")}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Pages:
        </h2>

        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
          {formData.pages.map((page) => (
            <button
              key={page}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page);
              }}
              className={`px-4 py-2 font-medium text-sm focus:outline-none capitalize
										${
                      selectedPage === page.replace("/", "")
                        ? "border-b-2 border-indigo-500 text-indigo-500"
                        : "text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                    }`}
            >
              {PAGES_NAVIGATION[page as keyof typeof PAGES_NAVIGATION]?.label ||
                page.replace("/", "")}
            </button>
          ))}
        </div>

        <GeneratedContent
          generatedContent={selectedPageContent}
          setGeneratedContent={(newContentOrFn) => {
            if (typeof newContentOrFn === "function") {
              setGeneratedContent((prev) => {
                const updatedContent = newContentOrFn(selectedPageContent);
                return { ...prev, ...updatedContent };
              });
            } else {
              setGeneratedContent((prev) => ({ ...prev, ...newContentOrFn }));
            }
          }}
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="btn bg-slate-500 hover:bg-slate-600 text-white"
        >
          Back to Settings
        </button>
        <div className="space-x-4">
          <button
            type="submit"
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Update Website
          </button>
        </div>
      </div>
    </>
  );
};
