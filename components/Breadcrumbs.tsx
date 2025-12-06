
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; onClick?: () => void }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-slate-500 mb-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <button 
        onClick={items[0].onClick} // Home is always first
        className="hover:text-accent-600 transition flex items-center gap-1"
      >
        <Home size={14} />
        <span className="sr-only">Home</span>
      </button>
      
      {items.slice(1).map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="mx-2 text-slate-300" />
          {item.onClick ? (
            <button 
              onClick={item.onClick}
              className="hover:text-accent-600 transition font-medium text-slate-600"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-semibold text-accent-600 cursor-default">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
