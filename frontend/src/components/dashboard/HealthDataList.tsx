// src/components/dashboard/HealthDataList.tsx
import { FaPlus, FaTrash } from 'react-icons/fa';

interface HealthDataListProps {
  title: string;
  items: string[];
  placeholder: string;
}

// For now, this is a presentational component. State logic would be added later.
export const HealthDataList = ({ title, items, placeholder }: HealthDataListProps) => (
  <div className="bg-background-secondary p-8 rounded-xl border border-border-primary">
    {/* <h1 className="text-2xl font-bold text-text-primary mb-6">{title}</h1> */}
    <div className="space-y-3 mb-6">
      {items[0].length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4 p-3 bg-background-tertiary rounded-lg">
            <span className="font-semibold text-text-primary">{item}</span>
            <button className="text-text-secondary hover:text-accent-primary transition-colors">
              <FaTrash />
            </button>
          </div>
        ))
      ) : (
        <p className="text-text-secondary text-center py-4">Brak dodanych pozycji.</p>
      )}
    </div>
    <div className="flex gap-4 border-t border-border-primary pt-6">
      <input 
        type="text" 
        placeholder={placeholder}
        className="flex-1 px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight"
      />
      <button className="flex items-center gap-2 px-4 py-3 bg-accent-primary hover:bg-accent-primary-hover text-on-accent font-bold rounded-lg">
        <FaPlus />
        <span>Dodaj</span>
      </button>
    </div>
  </div>
);