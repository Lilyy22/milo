import React from 'react';
import { EditableTextField } from '../editable-fields';

type ContactPageContentProps = {
  content: string;
  onChange: (content: string) => void;
};

export const ContactPageContent = ({ 
  content, 
  onChange 
}: ContactPageContentProps) => {
  return (
    <div className="space-y-4">
      <EditableTextField 
        label="Contact Information" 
        value={content} 
        onChange={onChange} 
        multiline 
      />
    </div>
  );
};

export const renderContactPageContent = (content: string) => {
  if (!content) return <p>No contact information generated yet</p>;
  
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="whitespace-pre-line">{content}</p>
    </div>
  );
}; 