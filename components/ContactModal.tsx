
import React from 'react';
import { X, Scale } from 'lucide-react';
import { ContactForm } from './ContactForm';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Scale className="text-accent-600 w-6 h-6" />
            <h2 className="text-xl font-serif font-bold text-navy-900">Get a Free Evaluation</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500 hover:text-navy-900">
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto">
            <p className="text-slate-600 mb-6 text-sm">
                Fill out the form below to connect with an attorney. All communications are confidential.
            </p>
            <ContactForm />
        </div>
      </div>
    </div>
  );
};
