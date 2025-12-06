
import React, { useState } from 'react';
import { Briefcase, Building2, Lightbulb, HeartPulse, Shield, Clock, Award, ChevronRight, ChevronDown, ChevronUp, Trophy, Gavel, ArrowUpRight, ArrowRight, Filter, Plus, Minus, HelpCircle } from 'lucide-react';
import { Attorney, CaseResult } from '../types';

interface PracticeAreasProps {
    onViewArea: (id: string) => void;
}

export const PracticeAreas: React.FC<PracticeAreasProps> = ({ onViewArea }) => {
  const areas = [
    { id: 'business-law', icon: <Briefcase size={32} />, title: 'Business Law', desc: 'Formation, contracts, and dispute resolution for small to mid-sized enterprises.' },
    { id: 'corporate-law', icon: <Building2 size={32} />, title: 'Corporate Law', desc: 'M&A, governance, and compliance strategies for large corporations.' },
    { id: 'intellectual-property', icon: <Lightbulb size={32} />, title: 'Intellectual Property', desc: 'Protecting your patents, trademarks, and copyrights in a digital world.' },
    { id: 'personal-injury', icon: <HeartPulse size={32} />, title: 'Personal Injury', desc: 'Aggressive representation for those wronged by negligence or malpractice.' },
  ];

  return (
    <section id="practice" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy-900 mb-4">Our Practice Areas</h2>
          <div className="h-1 w-20 bg-accent-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Focused expertise delivered with precision and deep industry knowledge.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {areas.map((area, idx) => (
            <div 
                key={idx} 
                onClick={() => onViewArea(area.id)}
                className="p-8 border border-slate-100 rounded-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white group cursor-pointer"
            >
              <div className="text-accent-600 mb-6 group-hover:scale-110 transition-transform duration-300">{area.icon}</div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">{area.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{area.desc}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); onViewArea(area.id); }}
                className="text-accent-600 font-semibold text-sm hover:underline flex items-center gap-1 bg-transparent border-none p-0"
              >
                Learn More <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface RecentVictoriesProps {
    results: CaseResult[];
    onViewAll: () => void;
}

export const RecentVictories: React.FC<RecentVictoriesProps> = ({ results, onViewAll }) => {
    // Filter to get one highlight per practice area for the dashboard
    const highlights = [
        results.find(r => r.practiceArea === 'Corporate Law'),
        results.find(r => r.practiceArea === 'Personal Injury'),
        results.find(r => r.practiceArea === 'Business Law'),
        results.find(r => r.practiceArea === 'Intellectual Property'),
    ].filter(Boolean) as CaseResult[];

    const getBorderColor = (area: string) => {
        switch (area) {
            case 'Corporate Law': return 'border-t-blue-500';
            case 'Personal Injury': return 'border-t-rose-500';
            case 'Intellectual Property': return 'border-t-purple-500';
            case 'Business Law': return 'border-t-teal-500';
            default: return 'border-t-accent-500';
        }
    };

    return (
        <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-600 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-accent-500 font-bold mb-2 tracking-wider text-sm uppercase">
                            <Trophy size={16} />
                            <span>Proven Track Record</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">Recent Victories</h2>
                        <p className="text-slate-300">
                            We measure success by the value we create for our clients. Here are just a few of our recent judgments and settlements.
                        </p>
                    </div>
                    <button 
                        onClick={onViewAll}
                        className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full backdrop-blur-sm transition border border-white/10"
                    >
                        View Case Registry <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {highlights.map((result, idx) => (
                        <div 
                            key={idx} 
                            className={`bg-navy-800/50 backdrop-blur-sm border-x border-b border-navy-700 ${getBorderColor(result.practiceArea)} border-t-4 p-6 rounded-2xl hover:bg-navy-800 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden cursor-pointer`}
                            onClick={onViewAll}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <Gavel size={64} />
                            </div>
                            
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    result.practiceArea === 'Personal Injury' ? 'bg-rose-500' :
                                    result.practiceArea === 'Corporate Law' ? 'bg-blue-500' :
                                    result.practiceArea === 'Intellectual Property' ? 'bg-purple-500' :
                                    'bg-teal-500'
                                }`}></span>
                                {result.practiceArea}
                            </div>

                            <div className="mb-4">
                                <span className="text-3xl lg:text-4xl font-bold text-white block mb-1">
                                    {result.amount || "Undisclosed"}
                                </span>
                                <span className="text-accent-400 text-sm font-medium uppercase tracking-wide">
                                    {result.outcome}
                                </span>
                            </div>

                            <p className="text-slate-300 text-sm line-clamp-3 mb-6">
                                {result.description}
                            </p>

                            <button 
                                onClick={(e) => { e.stopPropagation(); onViewAll(); }}
                                className="flex items-center gap-2 text-sm font-bold text-white hover:text-accent-400 transition"
                            >
                                View Details <ArrowUpRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <button 
                        onClick={onViewAll}
                        className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full"
                    >
                        View All Results <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export const ValueProp: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-navy-900 text-white border-b border-navy-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto text-accent-500">
               <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold">Client-First Protection</h3>
            <p className="text-slate-400">We prioritize your interests above all, offering transparent communication and fierce advocacy.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto text-accent-500">
               <Award size={32} />
            </div>
            <h3 className="text-xl font-bold">Proven Track Record</h3>
            <p className="text-slate-400">Over $500M recovered for clients and hundreds of successful corporate mergers facilitated.</p>
          </div>
          <div className="space-y-4">
             <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto text-accent-500">
               <Clock size={32} />
            </div>
            <h3 className="text-xl font-bold">24/7 Responsiveness</h3>
            <p className="text-slate-400">Legal issues don't sleep. Our team and AI assistants ensure you're never left in the dark.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

interface TestimonialsProps {
  onViewAllResults: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ onViewAllResults }) => {
  return (
    <section id="testimonials" className="py-24 bg-slate-50 relative overflow-hidden">
       {/* Bg Pattern */}
       <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-navy-900 rounded-full blur-3xl"></div>
       </div>

       <div className="container mx-auto px-6 relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl font-serif font-bold text-navy-900 mb-2">Client Testimonials</h2>
                <div className="h-1 w-20 bg-accent-500"></div>
            </div>
         </div>

         <div className="grid md:grid-cols-3 gap-8">
           {[
             { quote: "FirmName Law Group handled our IP litigation with incredible skill. They understood the technology better than we expected.", author: "Marcus T.", role: "Tech CEO" },
             { quote: "I felt completely lost after my accident. They didn't just win my case; they helped me rebuild my life with dignity.", author: "Sarah J.", role: "Personal Injury Client" },
             { quote: "Strategic, aggressive, and highly intelligent. They guided our merger perfectly. Best corporate counsel we've ever hired.", author: "David L.", role: "Founder" }
           ].map((t, i) => (
             <div key={i} className="bg-white p-8 rounded-xl shadow-md border-t-4 border-accent-500 hover:shadow-lg transition">
               <div className="flex gap-1 text-yellow-400 mb-4">
                 {'★★★★★'}
               </div>
               <p className="text-slate-700 italic mb-6">"{t.quote}"</p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center font-bold text-navy-800">
                    {t.author.charAt(0)}
                 </div>
                 <div>
                   <p className="font-bold text-navy-900 text-sm">{t.author}</p>
                   <p className="text-xs text-slate-500">{t.role}</p>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
    </section>
  )
}

interface TeamProps {
    attorneys: Attorney[];
    onSelectAttorney: (id: string) => void;
}

export const Team: React.FC<TeamProps> = ({ attorneys, onSelectAttorney }) => {
    const [expandedAttorneyId, setExpandedAttorneyId] = useState<string | null>(null);
    const [filter, setFilter] = useState('All');

    const toggleExpand = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setExpandedAttorneyId(expandedAttorneyId === id ? null : id);
    };

    const practiceFilters = ['All', 'Business Law', 'Corporate Law', 'Intellectual Property', 'Personal Injury'];

    const filteredAttorneys = filter === 'All' 
        ? attorneys 
        : attorneys.filter(a => a.practiceAreas.some(pa => pa.includes(filter) || (filter === 'Intellectual Property' && pa.includes('Patent'))));

    return (
        <section id="attorneys" className="py-24 bg-white">
            <div className="container mx-auto px-6 text-center">
                 <h2 className="text-3xl font-serif font-bold text-navy-900 mb-4">Meet Our Attorneys</h2>
                 <p className="text-slate-600 mb-8">Dedicated experts fighting for your success.</p>

                 {/* Filters */}
                 <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {practiceFilters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                                filter === f 
                                    ? 'bg-navy-900 text-white border-navy-900 shadow-md' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-accent-500 hover:text-accent-600'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                 </div>

                 {filteredAttorneys.length === 0 ? (
                    <div className="text-slate-500 italic py-12">
                        No attorneys found for {filter}.
                    </div>
                 ) : (
                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto items-start">
                        {filteredAttorneys.map((attorney) => {
                            const isExpanded = expandedAttorneyId === attorney.id;
                            
                            return (
                                <div 
                                    key={attorney.id} 
                                    onClick={() => onSelectAttorney(attorney.id)}
                                    className={`group relative bg-white rounded-xl p-6 border border-transparent hover:border-slate-100 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col items-center animate-in fade-in zoom-in-95 ${isExpanded ? 'row-span-2 z-10' : ''}`}
                                >
                                    <div className="w-48 h-48 mx-auto bg-slate-200 rounded-full mb-6 overflow-hidden relative border-4 border-transparent group-hover:border-accent-500 transition-all duration-300 shrink-0">
                                        <img 
                                        src={attorney.imageUrl}
                                        alt={attorney.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-navy-900 group-hover:text-accent-600 transition">{attorney.name}</h3>
                                    <p className="text-accent-600 font-medium text-sm mb-4">{attorney.role}</p>
                                    
                                    {/* Bio Section - Conditional Rendering */}
                                    {isExpanded ? (
                                        <div className="text-left space-y-3 text-sm text-slate-600 animate-in fade-in duration-300 mb-6 bg-slate-50 p-4 rounded-lg w-full">
                                            {attorney.fullBio.map((paragraph, idx) => (
                                                <p key={idx}>{paragraph}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 text-sm line-clamp-3 px-2 mb-6 text-center flex-grow">
                                            {attorney.bio}
                                        </p>
                                    )}
                                    
                                    <div className="flex gap-2 mt-auto">
                                        <button 
                                            onClick={(e) => toggleExpand(e, attorney.id)}
                                            className="px-6 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-full hover:bg-slate-50 transition-all flex items-center gap-1"
                                        >
                                            {isExpanded ? (
                                                <>Read Less <ChevronUp size={14}/></>
                                            ) : (
                                                <>Read More <ChevronDown size={14}/></>
                                            )}
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectAttorney(attorney.id);
                                            }}
                                            className="px-6 py-2 bg-navy-900 text-white font-bold text-xs rounded-full hover:bg-accent-600 transition-all shadow-sm"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                 )}
            </div>
        </section>
    )
}

export const FAQSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Business Law');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const categories = ['Business Law', 'Corporate Law', 'Intellectual Property', 'Personal Injury', 'General'];

    const faqs = {
        'Business Law': [
            { q: "What types of business matters do you handle?", a: "We assist clients with contracts, business disputes, partnerships, compliance, negotiations, and general counsel services." },
            { q: "Can you help draft or review business contracts?", a: "Yes. We draft, review, and negotiate a wide range of contracts, including vendor agreements, service contracts, NDAs, and partnership agreements." },
            { q: "I’m starting a business. Can you help me choose the right structure?", a: "Yes. We explain the pros and cons of LLCs, partnerships, sole proprietorships, and corporations so you can make an informed decision." },
            { q: "What should I do if my business is facing a dispute or breach of contract?", a: "Contact us immediately. We assess the situation, determine your options, and assist in negotiation, mediation, or litigation when needed." },
            { q: "Do you help with business compliance issues?", a: "Absolutely. We advise on regulatory compliance, operational policies, licensing, and risk management." },
            { q: "Can you represent my business in negotiations?", a: "Yes. Our attorneys frequently negotiate deals, settlements, and contracts on behalf of businesses." }
        ],
        'Corporate Law': [
            { q: "What corporate law services do you offer?", a: "We help with governance, mergers and acquisitions, shareholder issues, compliance, restructuring, and executive-level legal strategy." },
            { q: "Can you help with corporate governance policies?", a: "Yes. We create and refine bylaws, governance frameworks, board procedures, and shareholder agreements." },
            { q: "What is corporate compliance, and why is it important?", a: "Compliance ensures your organization follows all laws and regulations. It prevents penalties and strengthens operational integrity." },
            { q: "Do you assist with mergers and acquisitions (M&A)?", a: "Yes. We support due diligence, drafting purchase agreements, negotiations, and closing transactions." },
            { q: "What should I do if there is a dispute among shareholders?", a: "We provide legal guidance, negotiation support, and representation in shareholder conflicts." },
            { q: "Can you help with corporate restructuring?", a: "Yes. We assist companies during major transitions, helping evaluate risks, reduce liabilities, and improve organizational structure." }
        ],
        'Intellectual Property': [
            { q: "What types of IP matters do you handle?", a: "We assist with trademarks, copyrights, licensing, trade secrets, infringement issues, and IP enforcement." },
            { q: "Can you help me register a trademark?", a: "Yes. We manage the entire process—from clearance searches to registration and enforcement." },
            { q: "What should I do if someone is using my brand name or creative work?", a: "Contact us immediately. We will evaluate your rights and discuss enforcement or resolution strategies." },
            { q: "Do you help draft licensing agreements?", a: "Yes. We assist with licensing, assignments, royalty agreements, and IP transfer contracts." },
            { q: "Can you help protect trade secrets?", a: "Absolutely. We develop confidentiality policies, NDAs, employee agreements, and enforcement strategies." },
            { q: "What is the difference between a trademark and a copyright?", a: "A trademark protects brand identifiers. A copyright protects creative work. We can explain which applies to your situation." }
        ],
        'Personal Injury': [
            { q: "What types of personal injury cases do you handle?", a: "We handle auto accidents, slip and falls, workplace injuries, product liability, and negligence cases." },
            { q: "Do I have to pay upfront for a personal injury case?", a: "Most personal injury matters are handled on a contingency fee—meaning you don’t pay unless we win." },
            { q: "How do I know if I have a personal injury claim?", a: "If you were injured due to another party’s negligence, you may have a claim. A consultation helps determine next steps." },
            { q: "What damages can I recover after an injury?", a: "You may be able to recover medical expenses, lost income, pain and suffering, and property damage." },
            { q: "How long do I have to file a personal injury claim?", a: "Deadlines vary by state and case type. Contact us as soon as possible to preserve your rights." },
            { q: "Should I talk to the insurance company before speaking with an attorney?", a: "It’s best to consult us first to avoid harming your claim." }
        ],
        'General': [
            { q: "Do you offer free consultations?", a: "Yes—contact us to schedule your consultation." },
            { q: "What information should I bring to my consultation?", a: "Bring documents, contracts, photos, timelines, and any communication related to your case." },
            { q: "How quickly will your firm respond to inquiries?", a: "Typically within 24 hours during business days." },
            { q: "Can you work with clients outside Missouri?", a: "We can discuss your situation and determine whether we can assist or refer you." }
        ]
    };

    const currentFAQs = faqs[activeTab as keyof typeof faqs];

    return (
        <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 text-accent-600 font-bold mb-2 uppercase tracking-wide text-sm">
                        <HelpCircle size={18} />
                        <span>Common Questions</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy-900">Frequently Asked Questions</h2>
                    <p className="mt-4 text-slate-600">Quick answers to common legal inquiries.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => { setActiveTab(cat); setOpenIndex(null); }}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                                activeTab === cat 
                                    ? 'bg-navy-900 text-white border-navy-900 shadow-lg'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-accent-500 hover:text-accent-600'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {currentFAQs.map((faq, idx) => (
                        <div 
                            key={idx} 
                            className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 ${
                                openIndex === idx 
                                    ? 'border-accent-500 shadow-md' 
                                    : 'border-slate-100 hover:border-slate-300'
                            }`}
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={`font-bold text-lg ${openIndex === idx ? 'text-accent-700' : 'text-navy-900'}`}>
                                    {faq.q}
                                </span>
                                {openIndex === idx ? (
                                    <Minus size={20} className="text-accent-500 shrink-0" />
                                ) : (
                                    <Plus size={20} className="text-slate-400 shrink-0" />
                                )}
                            </button>
                            
                            {openIndex === idx && (
                                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                                        {faq.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
