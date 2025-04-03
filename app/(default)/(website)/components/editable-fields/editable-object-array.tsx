import React from 'react';

type ItemType = {
  name: string;
  description: string;
};

type EditableObjectArrayProps = {
  items: ItemType[];
  onChange: (items: ItemType[]) => void;
  label: string;
};

export const EditableObjectArray = ({
  items,
  onChange,
  label
}: EditableObjectArrayProps) => {
  const handleItemChange = (index: number, field: 'name' | 'description', value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, { name: '', description: '' }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  return (
    <div>
      <label className="block text-lg font-medium text-slate-800 dark:text-slate-100 mb-3 pl-1">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="relative bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-200 grid grid-cols-[1fr_3fr] gap-8 mb-3 dark:border-slate-700">
          <div>
            <label className="block text-sm text-slate-800 dark:text-slate-100 mb-1 pl-1">Name</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              className="text-sm w-full p-1 border-0 border-b border-slate-300 bg-transparent focus:ring-0 focus:outline-none focus:border-indigo-500 transition-colors dark:border-slate-700 dark:bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-800 dark:text-slate-100 mb-1 pl-1">Description</label>
            <input
              type="text"
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              className="text-sm w-full p-1.5 border-0 border-b border-slate-300 bg-transparent focus:ring-0 focus:outline-none focus:border-indigo-500 transition-colors dark:border-slate-700 dark:bg-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 shadow rounded-sm border border-slate-500 dark:border-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
            aria-label="Remove item"
          >
            ×
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