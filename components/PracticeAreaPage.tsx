
import React from 'react';
import { ArrowLeft, CheckCircle, HelpCircle, Phone, Scale, Briefcase, Building2, Lightbulb, HeartPulse, Shield, Star, ChevronRight } from 'lucide-react';

interface PracticeAreaPageProps {
  areaId: string;
  onBack: () => void;
  onSchedule: () => void;
}

const DATA: Record<string, any> = {
  'business-law': {
    title: "Business Law Services in Lees Summit & Kansas City",
    subtitle: "Protecting Your Business with Strategic Legal Guidance Since 1981",
    icon: Briefcase,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    intro: [
      "Running a business comes with constant challenges—contracts, disputes, compliance, negotiations, partnerships, and risk. At Patrick Law Group, we provide strategic, practical Business Law solutions designed to protect your operations and support your long-term success.",
      "For more than 40 years, businesses across Lees Summit, Kansas City, and surrounding Missouri communities have trusted our firm for dependable counsel and strong legal advocacy."
    ],
    whatIs: {
      title: "What Is Business Law?",
      content: "Business Law encompasses the rules, regulations, and contractual frameworks that govern how companies operate. Whether you're launching a startup, renegotiating contracts, or managing internal disputes, solid legal guidance is essential."
    },
    commonIssues: [
      "Breach of contract disputes",
      "Drafting and reviewing vendor agreements",
      "Partnership or shareholder conflicts",
      "Business formation and structuring",
      "Regulatory and compliance concerns",
      "Negotiating deals with vendors, partners, or customers",
      "Collections and payment disputes"
    ],
    services: [
      { title: "Contract Drafting, Review & Negotiation", desc: "We draft clear, enforceable agreements—protecting your rights and reducing future risk." },
      { title: "Dispute Resolution", desc: "When disagreements arise, we negotiate or litigate with your long-term business goals in mind." },
      { title: "Business Formation", desc: "Choosing the right structure—LLC, Partnership, Corporation—can protect owners and minimize liability." },
      { title: "Regulatory & Compliance Support", desc: "We help businesses stay compliant with industry laws and Missouri requirements." },
      { title: "Ongoing General Counsel", desc: "For companies needing continuous legal support without hiring an in-house attorney." }
    ],
    whyChoose: [
      "40+ years of experience supporting Kansas City area businesses",
      "Proactive, strategic legal solutions",
      "Deep understanding of local and regional regulations",
      "Responsive communication and practical guidance"
    ],
    success: {
      title: "Contract Dispute Avoided Litigation",
      desc: "Helped a Missouri-based manufacturing company resolve a vendor dispute through negotiation—saving time, money, and preserving a key partnership."
    },
    faqs: [
      { q: "Do I need an attorney to start a business?", a: "While not required, legal guidance helps you choose the right structure and avoid costly mistakes." },
      { q: "What should I do if a vendor breaches a contract?", a: "Document everything and contact us promptly—we can assess your options and reduce financial risk." },
      { q: "How long does a contract review take?", a: "Most reviews are completed within a few business days." }
    ]
  },
  'corporate-law': {
    title: "Corporate Law Services in Lees Summit & Kansas City",
    subtitle: "Strategic Corporate Counsel for Growing Companies",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    intro: [
      "Corporate operations require thoughtful planning, strong governance, and compliance with rapidly evolving regulations. Since 1981, Patrick Law Group has provided corporations across Kansas City and Lees Summit with proactive, strategic legal guidance."
    ],
    whatIs: {
      title: "What Is Corporate Law?",
      content: "Corporate Law addresses the structure, governance, and financial activities of companies—from small corporations to regional enterprises."
    },
    commonIssues: [
      "Corporate governance framework development",
      "Shareholder negotiations and dispute resolution",
      "Mergers and acquisitions (M&A)",
      "Corporate restructuring",
      "Compliance and risk management",
      "Executive and board advisory"
    ],
    services: [
      { title: "Governance & Compliance", desc: "We help create governance structures that protect the company and maintain regulatory compliance." },
      { title: "Mergers & Acquisitions", desc: "From due diligence to closing documentation, we guide companies through every step of the M&A process." },
      { title: "Shareholder Matters", desc: "We assist with agreements, negotiations, and disputes to protect organizational stability." },
      { title: "Corporate Restructuring", desc: "Our team supports businesses through transitions, reorganizations, and growth phases." }
    ],
    whyChoose: [
      "Over 40 years of corporate legal experience",
      "Proven ability to manage complex, multi-party transactions",
      "Strategic approach aligned to company goals",
      "Deep knowledge of Missouri corporate regulations"
    ],
    success: {
      title: "Corporate Restructuring Success",
      desc: "Supported a regional corporation in a compliance-driven restructuring—helping avoid potential penalties while improving operational efficiency."
    },
    faqs: [
      { q: "Do you handle both small and large corporations?", a: "Yes—our firm supports corporations of all sizes." },
      { q: "What happens during an M&A consultation?", a: "We review goals, risks, financial documents, and legal structure considerations." },
      { q: "Can you help resolve shareholder disputes?", a: "Yes, through negotiation or litigation where necessary." }
    ]
  },
  'intellectual-property': {
    title: "Intellectual Property Protection in Kansas City & Lees Summit",
    subtitle: "Protecting Your Brand, Ideas & Creative Work",
    icon: Lightbulb,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    intro: [
      "In today’s digital world, protecting your intellectual property is essential. Patrick Law Group helps individuals, entrepreneurs, and businesses across the Kansas City Metro Area safeguard their ideas, branding, and creative assets."
    ],
    whatIs: {
      title: "What Is Intellectual Property Law?",
      content: "IP Law protects intangible assets such as logos, names, and branding (trademarks), creative works (copyrights), business secrets, licensing rights, and product designs."
    },
    commonIssues: [
      "Someone is using your brand name or logo",
      "You need to register a trademark or copyright",
      "You want to draft or negotiate licensing agreements",
      "You need to protect trade secrets",
      "Your creative work or invention is being misused"
    ],
    services: [
      { title: "Trademark Registration & Enforcement", desc: "From clearance searches to USPTO filings and enforcement actions." },
      { title: "Copyright Protection", desc: "We help safeguard your creative works and respond to infringement." },
      { title: "Trade Secret Protection", desc: "Confidentiality agreements, employee contracts, policies, and litigation support." },
      { title: "Licensing Agreements", desc: "Clear, enforceable agreements for creative, software, or commercial rights." }
    ],
    whyChoose: [
      "40+ years of legal insight",
      "Clear, easy-to-understand guidance",
      "Strong experience enforcing IP rights",
      "Trusted by local entrepreneurs and growing brands"
    ],
    success: {
      title: "Trademark Enforcement Victory",
      desc: "Successfully prevented unauthorized commercial use of a client’s brand—protecting their reputation and market position."
    },
    faqs: [
      { q: "What’s the difference between a trademark and a copyright?", a: "Trademarks protect brands; copyrights protect creative work." },
      { q: "How long does trademark registration take?", a: "Most filings take 6–12 months depending on USPTO review." },
      { q: "Can you help if someone stole my content?", a: "Yes—contact us immediately for guidance on next steps." }
    ]
  },
  'personal-injury': {
    title: "Personal Injury Attorney in Kansas City & Lees Summit",
    subtitle: "If You’ve Been Injured, We’re Here to Help",
    icon: HeartPulse,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    intro: [
      "An injury can disrupt your entire life—physically, financially, and emotionally. Patrick Law Group helps injury victims across Lees Summit and Kansas City recover compensation and move forward confidently."
    ],
    whatIs: {
      title: "What Is Personal Injury Law?",
      content: "Personal Injury Law involves injuries caused by negligence, unsafe conditions, defective products, or accidents."
    },
    commonIssues: [
      "Car and truck accidents",
      "Motorcycle accidents",
      "Slip-and-fall injuries",
      "Workplace injuries",
      "Negligence claims",
      "Product liability cases"
    ],
    services: [
      { title: "Free Case Evaluation", desc: "You pay nothing upfront—most cases operate on a contingency fee basis." },
      { title: "Evidence Collection & Investigation", desc: "We gather records, statements, photos, and documentation to build the case." },
      { title: "Negotiation with Insurance Companies", desc: "We advocate strongly for the compensation you deserve." },
      { title: "Litigation Support", desc: "If negotiations fail, we can pursue litigation." }
    ],
    whyChoose: [
      "40+ years of trusted legal representation",
      "Compassionate, client-centered approach",
      "Strong negotiation and litigation experience"
    ],
    success: {
      title: "Auto Accident Settlement",
      desc: "Recovered full compensation for a client injured in a highway collision, covering medical bills, lost income, and long-term therapy."
    },
    faqs: [
      { q: "Do I pay anything upfront?", a: "No—personal injury cases are often handled on a contingency fee basis." },
      { q: "Should I talk to insurance without an attorney?", a: "It’s best to speak with an attorney first to avoid undervaluing your claim." },
      { q: "How long do PI cases take?", a: "Timelines vary; many settle within several months." }
    ]
  }
};

export const PracticeAreaPage: React.FC<PracticeAreaPageProps> = ({ areaId, onBack, onSchedule }) => {
  const content = DATA[areaId];

  if (!content) return null;

  const Icon = content.icon || Scale;

  return (
    <div className="pb-20 bg-slate-50 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Back Button (Retained for convenience) */}
      <div className="container mx-auto px-6 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-accent-600 transition font-medium text-sm"
        >
          <ArrowLeft size={16} />
          Back to Practice Areas
        </button>
      </div>

      {/* Hero Header */}
      <section className="container mx-auto px-6 mb-16">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row items-start gap-8">
           <div className={`p-4 rounded-2xl ${content.bgColor} ${content.color} mb-4 inline-block`}>
              <Icon size={48} />
           </div>
           <div className="flex-1">
              <h1 className="text-3xl lg:text-5xl font-serif font-bold text-navy-900 mb-4 leading-tight">
                {content.title}
              </h1>
              <p className="text-xl text-accent-600 font-medium mb-6">
                {content.subtitle}
              </p>
              <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                {content.intro.map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-6 mb-20">
        <div className="grid lg:grid-cols-3 gap-12">
           
           {/* Left Content Column */}
           <div className="lg:col-span-2 space-y-16">
              
              {/* What Is */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">{content.whatIs.title}</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{content.whatIs.content}</p>
              </div>

              {/* Common Issues */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-6">Common Issues We Handle</h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {content.commonIssues.map((issue: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                       <CheckCircle size={20} className="text-accent-500 shrink-0 mt-0.5" />
                       <span className="text-slate-700 font-medium">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Our Services */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-6">Our Services</h2>
                <div className="space-y-6">
                  {content.services.map((service: any, idx: number) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border-l-4 border-accent-500 shadow-sm">
                       <h3 className="text-lg font-bold text-navy-900 mb-2">{service.title}</h3>
                       <p className="text-slate-600">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Success */}
              <div className="bg-navy-900 text-white p-8 rounded-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-accent-600 rounded-full blur-[60px] opacity-20"></div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 text-accent-400 font-bold uppercase tracking-wider text-xs mb-3">
                       <Star size={14} /> Recent Success
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-2">{content.success.title}</h3>
                    <p className="text-slate-300 italic">"{content.success.desc}"</p>
                 </div>
              </div>

              {/* FAQs */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-6 flex items-center gap-2">
                   <HelpCircle className="text-accent-600" /> Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {content.faqs.map((faq: any, idx: number) => (
                    <div key={idx} className="border-b border-slate-200 pb-4">
                       <h4 className="font-bold text-navy-900 mb-2">{faq.q}</h4>
                       <p className="text-slate-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

           </div>

           {/* Right Sidebar */}
           <div className="lg:col-span-1 space-y-8">
              
              {/* Why Choose Us */}
              <div className="bg-slate-100 p-8 rounded-2xl">
                 <h3 className="text-xl font-bold text-navy-900 mb-6">Why Choose Us</h3>
                 <ul className="space-y-4">
                   {content.whyChoose.map((reason: string, idx: number) => (
                     <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center shrink-0 mt-0.5">
                           <CheckCircle size={14} className="text-white" />
                        </div>
                        <span className="text-slate-700 text-sm font-medium">{reason}</span>
                     </li>
                   ))}
                 </ul>
              </div>

              {/* CTA Box */}
              <div className="bg-accent-600 text-white p-8 rounded-2xl shadow-xl text-center">
                 <Phone size={32} className="mx-auto mb-4 text-accent-100" />
                 <h3 className="text-xl font-bold mb-2">Free Consultation</h3>
                 <p className="text-accent-50 mb-6 text-sm">
                   Get clarity on your legal situation today. No obligation, just honest advice.
                 </p>
                 <button 
                   onClick={onSchedule}
                   className="w-full py-3 bg-white text-navy-900 font-bold rounded hover:bg-slate-50 transition shadow-lg flex items-center justify-center gap-2"
                 >
                   Schedule Now <ChevronRight size={16} />
                 </button>
                 <div className="mt-4 text-xs text-accent-100 font-medium">
                    Call: (800) 555-1212
                 </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-slate-400 leading-tight">
                 *Past results do not guarantee future outcomes. Information on this page is for educational purposes only.
              </p>

           </div>
        </div>
      </section>

    </div>
  );
};
