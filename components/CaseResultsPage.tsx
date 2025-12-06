
import React, { useState } from 'react';
import { ArrowLeft, Gavel, TrendingUp, ShieldCheck, Clock, Target, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { CaseResult } from '../types';

interface CaseResultsPageProps {
  results: CaseResult[];
  onBack: () => void;
}

const getPracticeColor = (area: string) => {
  switch (area) {
    case 'Corporate Law': return 'border-l-slate-600';
    case 'Personal Injury': return 'border-l-rose-500';
    case 'Intellectual Property': return 'border-l-indigo-500';
    case 'Business Law': return 'border-l-blue-500';
    default: return 'border-l-accent-500';
  }
};

const getPracticeBadgeColor = (area: string) => {
  switch (area) {
    case 'Corporate Law': return 'bg-slate-100 text-slate-700';
    case 'Personal Injury': return 'bg-rose-50 text-rose-700';
    case 'Intellectual Property': return 'bg-indigo-50 text-indigo-700';
    case 'Business Law': return 'bg-blue-50 text-blue-700';
    default: return 'bg-accent-50 text-accent-700';
  }
};

export const CaseResultsPage: React.FC<CaseResultsPageProps> = ({ results, onBack }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  return (
    <div className="pb-20 bg-slate-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-6">
        
        {/* Back Button (Mobile optimized) */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-accent-600 transition mb-6 font-medium text-sm md:hidden"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-navy-900 mb-4">Case Results</h1>
          <div className="h-1 w-24 bg-accent-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            We don't just practice law; we win. Detailed below are recent victories that demonstrate our strategic approach.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((result) => {
            const isExpanded = expandedIds.has(result.id);
            
            return (
              <div 
                key={result.id} 
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border-l-4 ${getPracticeColor(result.practiceArea)} flex flex-col group`}
              >
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getPracticeBadgeColor(result.practiceArea)}`}>
                          {result.practiceArea}
                      </span>
                      <Clock size={16} className="text-slate-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-navy-900 mb-6 leading-tight group-hover:text-accent-600 transition-colors">
                      {result.title}
                  </h3>
                  
                  {/* Basic Info (Always Visible) */}
                  <div className="mb-6">
                     <p className="text-slate-600 font-medium italic">"{result.description}"</p>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mb-6">
                      <div>
                          <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Duration</span>
                          <span className="text-sm font-medium text-navy-800">{result.duration}</span>
                      </div>
                      <div className="text-right">
                          <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Outcome</span>
                          {result.amount ? (
                              <span className="text-lg font-bold text-green-600">{result.amount}</span>
                          ) : (
                              <span className="text-lg font-bold text-navy-900">Confidential</span>
                          )}
                      </div>
                  </div>

                  {/* Expandable Detailed Info */}
                  {isExpanded && (
                    <div className="space-y-6 flex-1 pt-4 border-t border-dashed border-slate-200 animate-in slide-in-from-top-2">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 mb-2">
                                <Target size={16} className="text-red-500" /> Challenge
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{result.challenge}</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 mb-2">
                                <Scale size={16} className="text-blue-500" /> Strategy
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{result.strategy}</p>
                        </div>
                    </div>
                  )}

                  <button 
                    onClick={() => toggleExpand(result.id)}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm font-bold text-accent-600 hover:bg-accent-50 rounded transition-colors"
                  >
                    {isExpanded ? (
                        <>Hide Details <ChevronUp size={16}/></>
                    ) : (
                        <>Learn More <ChevronDown size={16}/></>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="mt-20 bg-accent-600 rounded-2xl p-8 lg:p-12 text-center text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10">
             <h2 className="text-3xl font-serif font-bold mb-4">Do you have a similar case?</h2>
             <p className="text-accent-100 mb-8 max-w-2xl mx-auto">Every case is unique, but our commitment to winning remains the same. Contact us for a free evaluation of your legal standing.</p>
             <a href="#contact" className="inline-block px-8 py-4 bg-white text-navy-900 font-bold rounded shadow-lg hover:bg-slate-100 transition transform hover:scale-105">
               Get Your Free Evaluation
             </a>
           </div>
           {/* Background Pattern */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <TrendingUp className="absolute top-10 left-10 w-40 h-40" />
              <ShieldCheck className="absolute bottom-10 right-10 w-40 h-40" />
           </div>
        </div>

      </div>
    </div>
  );
};
