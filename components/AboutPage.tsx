
import React from 'react';
import { ArrowLeft, Shield, Target, Users, History, CheckCircle, Scale, TrendingUp, Award, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  onSchedule: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack, onSchedule }) => {
  return (
    <div className="pb-20 bg-slate-50 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Navigation Back (Optional, mostly redundant with breadcrumbs but good for mobile) */}
      <div className="container mx-auto px-6 mb-8 block md:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-accent-600 transition font-medium text-sm"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>

      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-navy-900 text-white py-20 lg:py-28 overflow-hidden rounded-3xl mx-4 lg:mx-8 mb-20 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-navy-800/50 skew-x-12 translate-x-32 z-0"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent-600 rounded-full blur-[120px] opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-300 text-xs font-bold tracking-widest uppercase mb-6">
            Est. 1981 &bull; Lees Summit, MO
          </span>
          <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            Committed to Excellence <span className="text-accent-500">Since 1981</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Four decades of strategic legal advocacy, combining deep-rooted community values with aggressive, modern representation for businesses and individuals.
          </p>
        </div>
      </section>

      {/* 2. HISTORY OF THE FIRM */}
      <section className="container mx-auto px-6 mb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
             <div className="relative">
                <div className="absolute top-4 left-4 w-full h-full border-2 border-accent-500 rounded-2xl z-0"></div>
                <div className="bg-slate-200 rounded-2xl h-[500px] w-full relative z-10 overflow-hidden shadow-xl">
                   {/* Abstract Placeholder for History Image */}
                   <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center">
                      <History size={120} className="text-white/10" />
                   </div>
                   <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                      <p className="font-serif italic text-lg">"From a single office in Lees Summit to a regional powerhouse."</p>
                   </div>
                </div>
             </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-serif font-bold text-navy-900 mb-6">Our Legacy & Evolution</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                Patrick Law Group was founded in <strong>1981</strong> with a singular vision: to deliver strategic, client-centered legal guidance that cuts through complexity. What began as a small local practice in Lees Summit has evolved into a trusted regional law firm known for handling high-stakes matters with precision.
              </p>
              <p>
                Founded on the values of integrity, fierce advocacy, and radical transparency, we have spent over 40 years building long-term relationships with our clients. We don't just close cases; we protect futures.
              </p>
              <p>
                Throughout our history, we have consistently adapted to the changing legal landscape. Key milestones in our growth include the major expansion of our <strong>Business & Corporate Law</strong> division, the establishment of a specialized <strong>Intellectual Property</strong> practice to protect modern innovators, and the development of a full-service <strong>Personal Injury</strong> division dedicated to justice. Today, we are proud to adopt modern technology, including AI-driven client services, to ensure our firm remains as accessible as it is authoritative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION STATEMENT */}
      <section className="bg-accent-50 py-20 mb-24 border-y border-accent-100">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <Scale size={48} className="text-accent-600 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy-900 mb-8">Our Mission</h2>
          <blockquote className="text-2xl lg:text-3xl font-light text-navy-800 leading-normal italic relative">
            "Our mission is to deliver strategic, compassionate, and results-driven legal representation that empowers individuals, innovators, and businesses to move forward with confidence."
          </blockquote>
          <div className="mt-10 grid md:grid-cols-3 gap-8 text-left">
             <div className="flex items-start gap-3">
                <CheckCircle className="text-accent-600 shrink-0 mt-1" />
                <p className="text-sm text-navy-800 font-medium">Protecting clients' businesses, creations, and personal rights.</p>
             </div>
             <div className="flex items-start gap-3">
                <CheckCircle className="text-accent-600 shrink-0 mt-1" />
                <p className="text-sm text-navy-800 font-medium">Dedication to ethical representation and strategic thinking.</p>
             </div>
             <div className="flex items-start gap-3">
                <CheckCircle className="text-accent-600 shrink-0 mt-1" />
                <p className="text-sm text-navy-800 font-medium">Building long-term partnerships based on community trust.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. FIRM GOALS & VALUES */}
      <section className="container mx-auto px-6 mb-24">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-serif font-bold text-navy-900 mb-4">What Drives Us</h2>
           <div className="h-1 w-20 bg-accent-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Users, title: "Client-Centric Service", desc: "Providing exceptional service rooted in empathy and clear, jargon-free communication." },
            { icon: Target, title: "Strategic Solutions", desc: "Delivering legal guidance that solves real business and personal challenges, not just theoretical ones." },
            { icon: Shield, title: "Unwavering Ethics", desc: "Upholding the highest standards of ethics and professionalism in every courtroom and boardroom." },
            { icon: TrendingUp, title: "Innovation", desc: "Investing in continuing education and technology to provide efficient, modern representation." },
            { icon: History, title: "Lasting Relationships", desc: "Building relationships based on trust and transparency that last for decades, not just a single case." },
            { icon: Award, title: "Excellence", desc: "Excelling in negotiation, litigation, and dispute resolution to secure the best possible outcomes." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl shadow-md border border-slate-100 hover:border-accent-200 transition-colors group">
              <div className="w-12 h-12 bg-navy-50 rounded-full flex items-center justify-center text-navy-900 mb-4 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MAJOR CASES & NOTABLE RESULTS */}
      <section className="bg-navy-900 text-white py-20 mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 right-10 w-64 h-64 bg-accent-500 rounded-full blur-[80px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Notable Cases & Results</h2>
            <p className="text-slate-300 max-w-2xl">
              While we protect our clients' confidentiality, these anonymized highlights demonstrate the caliber of our work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-navy-800/50 p-8 rounded-xl border border-navy-700 hover:bg-navy-800 transition">
               <h3 className="text-accent-400 font-bold uppercase tracking-wider text-sm mb-2">Business Law Victory</h3>
               <p className="font-serif text-xl font-bold mb-4">Resolved Multi-Party Contract Dispute</p>
               <p className="text-slate-300 text-sm leading-relaxed mb-4">
                 Successfully negotiated a settlement for a regional company facing a complex breach of contract claim involving three parties.
               </p>
               <div className="flex items-center gap-2 text-white font-semibold text-sm">
                 <CheckCircle size={16} className="text-green-500" /> Prevented litigation & saved operational costs.
               </div>
            </div>

            <div className="bg-navy-800/50 p-8 rounded-xl border border-navy-700 hover:bg-navy-800 transition">
               <h3 className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-2">Corporate Law Achievement</h3>
               <p className="font-serif text-xl font-bold mb-4">Restructuring & Compliance Overhaul</p>
               <p className="text-slate-300 text-sm leading-relaxed mb-4">
                 Guided a major corporation through a high-risk restructuring phase while implementing new governance protocols.
               </p>
               <div className="flex items-center gap-2 text-white font-semibold text-sm">
                 <CheckCircle size={16} className="text-green-500" /> Safeguarded against regulatory penalties.
               </div>
            </div>

            <div className="bg-navy-800/50 p-8 rounded-xl border border-navy-700 hover:bg-navy-800 transition">
               <h3 className="text-purple-400 font-bold uppercase tracking-wider text-sm mb-2">Intellectual Property Success</h3>
               <p className="font-serif text-xl font-bold mb-4">Trademark Enforcement Action</p>
               <p className="text-slate-300 text-sm leading-relaxed mb-4">
                 Enforced trademark rights for a rapidly growing lifestyle brand against a competitor attempting to confuse consumers.
               </p>
               <div className="flex items-center gap-2 text-white font-semibold text-sm">
                 <CheckCircle size={16} className="text-green-500" /> Stopped unauthorized use & preserved brand identity.
               </div>
            </div>

            <div className="bg-navy-800/50 p-8 rounded-xl border border-navy-700 hover:bg-navy-800 transition">
               <h3 className="text-rose-400 font-bold uppercase tracking-wider text-sm mb-2">Personal Injury Settlement</h3>
               <p className="font-serif text-xl font-bold mb-4">Major Auto Accident Compensation</p>
               <p className="text-slate-300 text-sm leading-relaxed mb-4">
                 Secured a significant settlement for a client suffering long-term injuries from a collision with a commercial vehicle.
               </p>
               <div className="flex items-center gap-2 text-white font-semibold text-sm">
                 <CheckCircle size={16} className="text-green-500" /> Covered medical expenses, lost wages & long-term care.
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR COMMITMENT TODAY & CTA */}
      <section className="container mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
          <div className="lg:w-2/3 p-10 lg:p-16">
            <h2 className="text-3xl font-serif font-bold text-navy-900 mb-6">Our Commitment Today</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
               Patrick Law Group continues its legacy of excellence by refusing to stand still. Since 1981, we have prioritized the needs of our community, but today we do so with more tools at our disposal than ever before.
            </p>
            <p className="text-slate-600 leading-relaxed mb-10">
               From our investment in AI-enabled client support to our modern, data-driven legal strategies, we remain dedicated to providing accessible, top-tier representation. Whether you are a startup founder or an injury victim, our promise remains the same: <strong>We fight for you.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
               <button 
                 onClick={onSchedule}
                 className="px-8 py-4 bg-navy-900 text-white font-bold rounded hover:bg-navy-800 transition shadow-lg flex items-center justify-center gap-2"
               >
                 Schedule a Free Consultation <ArrowRight size={18} />
               </button>
               <button 
                 onClick={onSchedule}
                 className="px-8 py-4 bg-white text-navy-900 border border-slate-200 font-bold rounded hover:bg-slate-50 transition flex items-center justify-center"
               >
                 Speak With Our Team
               </button>
            </div>
          </div>
          <div className="lg:w-1/3 bg-slate-100 relative min-h-[300px] lg:min-h-full">
             <div className="absolute inset-0 bg-gradient-to-br from-accent-600 to-navy-900 opacity-90"></div>
             {/* Decorative Pattern */}
             <div className="absolute inset-0 flex items-center justify-center">
                <Scale size={140} className="text-white/20" />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};
