
import React from 'react';
import { ArrowLeft, Mail, Phone, Linkedin, Award, GraduationCap } from 'lucide-react';
import { Attorney } from '../types';

interface AttorneyProfileProps {
  attorney: Attorney;
  onBack: () => void;
  onSchedule?: () => void;
}

export const AttorneyProfile: React.FC<AttorneyProfileProps> = ({ attorney, onBack, onSchedule }) => {
  return (
    <div className="pb-20 bg-slate-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-6">
        
        {/* Back Button (Retained for convenience, though Breadcrumbs exist now) */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-accent-600 transition mb-6 font-medium text-sm"
        >
          <ArrowLeft size={16} />
          Back to Team
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="flex flex-col lg:flex-row">
            
            {/* Sidebar / Left Column */}
            <div className="lg:w-1/3 bg-navy-900 text-white p-8 lg:p-12 text-center lg:text-left relative overflow-hidden">
               {/* Background Decor */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10">
                  <div className="w-48 h-48 mx-auto lg:mx-0 rounded-full border-4 border-accent-500 overflow-hidden mb-6 shadow-lg">
                    <img src={attorney.imageUrl} alt={attorney.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <h1 className="text-3xl font-serif font-bold mb-2">{attorney.name}</h1>
                  <p className="text-accent-400 font-medium text-lg mb-6">{attorney.role}</p>
                  
                  <div className="space-y-4 text-sm mb-8">
                    <a href={`mailto:${attorney.email}`} className="flex items-center justify-center lg:justify-start gap-3 text-slate-300 hover:text-white transition">
                      <Mail size={18} className="text-accent-500" />
                      {attorney.email}
                    </a>
                    <a href={`tel:${attorney.phone}`} className="flex items-center justify-center lg:justify-start gap-3 text-slate-300 hover:text-white transition">
                      <Phone size={18} className="text-accent-500" />
                      {attorney.phone}
                    </a>
                    <a href="#" className="flex items-center justify-center lg:justify-start gap-3 text-slate-300 hover:text-white transition">
                      <Linkedin size={18} className="text-accent-500" />
                      LinkedIn Profile
                    </a>
                  </div>

                  <div className="border-t border-navy-700 pt-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                       <Award size={20} className="text-accent-500" /> 
                       Practice Areas
                    </h3>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                      {attorney.practiceAreas.map((area, idx) => (
                        <span key={idx} className="px-3 py-1 bg-navy-800 text-slate-200 text-xs rounded-full border border-navy-700">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            {/* Main Content / Right Column */}
            <div className="lg:w-2/3 p-8 lg:p-12">
               <div className="max-w-3xl">
                 <h2 className="text-2xl font-serif font-bold text-navy-900 mb-6 border-b border-slate-100 pb-4">Biography</h2>
                 <div className="space-y-4 text-slate-600 leading-relaxed mb-10">
                    {attorney.fullBio.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                 </div>

                 <h3 className="text-xl font-serif font-bold text-navy-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="text-accent-600" />
                    Education & Admissions
                 </h3>
                 <ul className="space-y-2 mb-10">
                    {attorney.education.map((edu, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0"></span>
                        {edu}
                      </li>
                    ))}
                 </ul>

                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-navy-900 mb-2">Need legal assistance?</h3>
                    <p className="text-slate-600 text-sm mb-4">Contact {attorney.name.split(' ')[0]} directly to discuss your case.</p>
                    <button 
                      onClick={onSchedule}
                      className="inline-block px-6 py-2.5 bg-navy-900 text-white text-sm font-bold rounded hover:bg-navy-800 transition"
                    >
                      Schedule Consultation
                    </button>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
