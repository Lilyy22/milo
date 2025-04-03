import React from 'react';

type EditableTextFieldProps = {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  label: string;
};

export const EditableTextField = ({
  value,
  onChange,
  multiline = false,
  label
}: EditableTextFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-800 dark:text-slate-100 mb-3 pl-1">{label}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="form-input w-full"
          rows={5}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="form-input w-full"
        />
      )}
    </div>
  );
}; 