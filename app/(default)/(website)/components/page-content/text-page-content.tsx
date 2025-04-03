import React from 'react';
import { EditableTextField } from '../editable-fields';

type TextPageContentProps = {
  content: string;
  onChange: (content: string) => void;
};

export const TextPageContent = ({ 
  content, 
  onChange 
}: TextPageContentProps) => {
  return (
    <div className="space-y-4">
      <EditableTextField 
        label="Page Content" 
        value={content} 
        onChange={onChange} 
        multiline 
      />
    </div>
  );
};

export const renderTextPageContent = (content: string) => {
  if (!content) return <p>No content generated yet</p>;
  
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="whitespace-pre-line">{content}</p>
    </div>
  );
}; 