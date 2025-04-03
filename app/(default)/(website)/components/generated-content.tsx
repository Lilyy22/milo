import { useState } from 'react'
import {
  HomePageContent, renderHomePageContent,
  AboutPageContent, renderAboutPageContent,
  TextPageContent, renderTextPageContent,
  ContactPageContent, renderContactPageContent
} from './page-content'

type GeneratedContentProps = {
  generatedContent: Record<string, any>
  setGeneratedContent: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

export const GeneratedContent = ({ generatedContent, setGeneratedContent }: GeneratedContentProps) => {
  const [editingPage, setEditingPage] = useState<string | null>(null);

  const handleEdit = (page: string) => setEditingPage(page);
  const handleSave = (page: string) => setEditingPage(null);
  const handleCancel = () => setEditingPage(null);

  const updatePageContent = (page: string, content: any) => setGeneratedContent(prev => ({ ...prev, [page]: content }));

  // Render the appropriate content editor for each page type
  const renderPageEditor = (page: string, content: any) => {
    switch (page) {
      case 'home':
        return <HomePageContent content={content} onChange={(updatedContent) => updatePageContent(page, updatedContent)} />;
      case 'about':
        return <AboutPageContent content={content} onChange={(updatedContent) => updatePageContent(page, updatedContent)} />;
      case 'blog':
      case 'news':
        return <TextPageContent content={content} onChange={(updatedContent) => updatePageContent(page, updatedContent)} />;
      case 'contact':
        return <ContactPageContent content={content} onChange={(updatedContent) => updatePageContent(page, updatedContent)} />;
      default:
        return <pre className="bg-slate-100 dark:bg-slate-800 rounded p-4 my-4 overflow-x-auto">
          {JSON.stringify(content, null, 2)}
        </pre>;
    }
  };

  const renderPageContent = (page: string, content: any) => {
    if (!content) return <p>No content generated yet</p>;

    switch (page) {
      case 'home':
        return renderHomePageContent(content);
      case 'about':
        return renderAboutPageContent(content);
      case 'blog':
      case 'news':
        return renderTextPageContent(content);
      case 'contact':
        return renderContactPageContent(content);
      default:
        return <pre className="bg-slate-100 dark:bg-slate-800 rounded p-4 my-4 overflow-x-auto">
          {JSON.stringify(content, null, 2)}
        </pre>;
    }
  };

  if (Object.keys(generatedContent).length === 0) {
    return (
      <div className="p-6 text-center bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p className="text-slate-700 dark:text-slate-300">No content has been generated yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {Object.entries(generatedContent).map(([page, pageContent]) => (
        <div className="capitalize" key={page}>
          <div className="relative">
            {editingPage !== page && (
              <button
                onClick={() => handleEdit(page)}
                className="absolute top-6 right-6 btn py-1 bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                Edit
              </button>
            )}

            <div className="p-4 border border-black/90 dark:border-white/90 rounded-sm">
              {editingPage === page ? (
                <div className="space-y-8">
                  <div className="dark:border-slate-700">
                    {renderPageEditor(page, pageContent)}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancel}
                      className="btn bg-slate-500 hover:bg-slate-600 text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(page)}
                      className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <article>
                  {pageContent ? renderPageContent(page, pageContent) : (
                    <p className="text-slate-500 italic">No content available for this page.</p>
                  )}
                </article>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 