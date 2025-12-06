
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const LegalModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-serif font-bold text-navy-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500 hover:text-navy-900">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto text-slate-600 text-sm leading-relaxed space-y-4">
          {children}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-navy-900 text-white rounded font-bold hover:bg-navy-800 transition">Close</button>
        </div>
      </div>
    </div>
  );
};

export const DisclaimerModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({isOpen, onClose}) => (
    <LegalModal isOpen={isOpen} onClose={onClose} title="Legal Disclaimer">
        <p><strong>No Attorney-Client Relationship Created by Use of this Website:</strong> Neither your receipt of information from this website, nor your use of this website to contact Patrick Law Firm or one of its attorneys creates an attorney-client relationship between you and Patrick Law Firm.</p>
        <p><strong>No Legal Advice Intended:</strong> The website includes information about legal issues and legal developments. Such materials are for informational purposes only and may not reflect the most current legal developments. These informational materials are not intended, and should not be taken, as legal advice on any particular set of facts or circumstances.</p>
        <p><strong>Third-party Websites:</strong> As a convenience, this website may provide links to third-party websites. Such linked websites are not under the control of Patrick Law Firm, and Patrick Law Firm assumes no responsibility for the accuracy of the contents of such websites.</p>
        <p><strong>Outcomes:</strong> Prior results do not guarantee a similar outcome.</p>
    </LegalModal>
);

export const TermsModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({isOpen, onClose}) => (
    <LegalModal isOpen={isOpen} onClose={onClose} title="Terms & Conditions">
        <p><strong>Acceptance of Terms:</strong> By accessing this website, you agree to be bound by these Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
        <p><strong>Use License:</strong> Permission is granted to temporarily download one copy of the materials (information or software) on Patrick Law Firm's website for personal, non-commercial transitory viewing only.</p>
        <p><strong>Limitations:</strong> In no event shall Patrick Law Firm or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Patrick Law Firm's website.</p>
        <p><strong>Governing Law:</strong> Any claim relating to Patrick Law Firm's website shall be governed by the laws of the State of Missouri without regard to its conflict of law provisions.</p>
    </LegalModal>
);

export const PrivacyPolicyModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({isOpen, onClose}) => (
    <LegalModal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
        <p><strong>Information Collection:</strong> We collect non-public personal information about you from the following sources: Information we receive from you on applications or other forms; Information about your transactions with us or others; and Information we receive from a consumer reporting agency.</p>
        <p><strong>Use of Information:</strong> We do not disclose any non-public personal information about our clients or former clients to anyone, except as permitted by law.</p>
        <p><strong>Security:</strong> We restrict access to non-public personal information about you to those employees who need to know that information to provide products or services to you. We maintain physical, electronic, and procedural safeguards that comply with federal regulations to guard your non-public personal information.</p>
    </LegalModal>
);
