
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-background-secondary rounded-xl border border-border-primary overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left bg-background-tertiary"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        <FaChevronDown className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="p-4 text-text-primary font-semibold">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};