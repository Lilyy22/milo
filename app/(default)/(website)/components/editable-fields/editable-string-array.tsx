import React from 'react';

type EditableStringArrayProps = {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
};

export const EditableStringArray = ({ 
  items, 
  onChange,
  label
}: EditableStringArrayProps) => {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, '']);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  return (
    <div className="mb-4">
      <label className="block text-lg font-medium text-slate-800 dark:text-slate-100 mb-3 pl-1">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-6 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            className="text-sm w-full p-1.5 border-0 border-b border-slate-300 bg-transparent focus:ring-0 focus:outline-none focus:border-indigo-500 transition-colors dark:border-slate-700 dark:bg-transparent"
            />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="flex items-center text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="mt-4 btn bg-indigo-500 hover:bg-indigo-600 text-white"
      >
        + Add Item
      </button>
    </div>
  );
}; 