
import React from 'react';
import { Scale, Linkedin, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './ContactForm';

interface FooterProps {
    onOpenDisclaimer: () => void;
    onOpenTerms: () => void;
    onOpenPrivacy: () => void;
    onSchedule: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDisclaimer, onOpenTerms, onOpenPrivacy, onSchedule }) => {
  return (
    <footer className="bg-navy-900 text-white pt-20 pb-8 border-t border-navy-800">
      <div className="container mx-auto px-6">
        
        {/* Contact Form Section */}
        <div id="contact" className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 lg:p-12 shadow-2xl mb-20 text-slate-900">
           <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900 mb-4">Get a Free Case Evaluation</h2>
               <p className="text-slate-600 mb-8">
                   Fill out the form below to connect with an attorney. All communications are confidential and we typically respond within 24 hours.
               </p>
               <ContactForm />
           </div>
           
           <div className="flex flex-col h-full">
               <div className="bg-navy-50 rounded-2xl overflow-hidden h-full min-h-[400px] border border-slate-200 relative">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3108.309067828065!2d-94.41724492426367!3d38.82555697174063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0e64c12345679%3A0xabcdef1234567890!2s1546%20SW%20Manor%20Lake%20Dr%2C%20Lee&#39;s%20Summit%2C%20MO%2064082!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Patrick Law Firm Location"
                  ></iframe>
               </div>
               <div className="mt-6 flex flex-col md:flex-row gap-6 text-sm">
                   <div className="flex items-start gap-3">
                       <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center shrink-0 text-navy-900">
                           <MapPin size={20} />
                       </div>
                       <div>
                           <h4 className="font-bold text-navy-900">Visit Us</h4>
                           <p className="text-slate-600">1546 SW Manor Lake Drive<br/>Lees Summit, MO 64082</p>
                       </div>
                   </div>
                   <div className="flex items-start gap-3">
                       <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center shrink-0 text-navy-900">
                           <Phone size={20} />
                       </div>
                       <div>
                           <h4 className="font-bold text-navy-900">Call Us</h4>
                           <p className="text-slate-600">(816) 555-1212<br/>Mon-Fri, 9am - 6pm</p>
                       </div>
                   </div>
               </div>
           </div>
        </div>

        {/* Links Section */}
        <div className="grid md:grid-cols-4 gap-12 mb-16 border-t border-navy-800 pt-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="text-accent-500" />
              <span className="text-xl font-serif font-bold">Patrick Law Firm</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Providing top-tier legal representation for businesses and individuals. We fight for your rights with integrity and strength.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Contact</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin size={18} className="text-accent-500 shrink-0 mt-0.5" />
                <span>1546 SW Manor Lake Drive<br/>Les Summit, MO 64082</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={18} className="text-accent-500 shrink-0" />
                <a href="tel:8165551212" className="hover:text-white transition">(816) 555-1212</a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={18} className="text-accent-500 shrink-0" />
                <a href="mailto:info@patricklaw.com" className="hover:text-white transition">info@patricklaw.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-accent-500 transition">Home</a></li>
              <li><a href="#practice" className="hover:text-accent-500 transition">Practice Areas</a></li>
              <li><a href="#attorneys" className="hover:text-accent-500 transition">Attorneys</a></li>
              <li><a href="#results" className="hover:text-accent-500 transition">Results</a></li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-accent-500 transition text-left">Terms & Conditions</button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-accent-500 transition text-left">Privacy Policy</button>
              </li>
              <li>
                <button onClick={onOpenDisclaimer} className="hover:text-accent-500 transition text-left">Disclaimer</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-accent-600 transition text-white">
                <Linkedin size={24} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-accent-600 transition text-white">
                <Facebook size={24} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-accent-600 transition text-white">
                <Twitter size={24} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-accent-600 transition text-white">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-8 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Patrick Law Firm. All rights reserved. Attorney Advertising.
        </div>
      </div>
    </footer>
  );
};
