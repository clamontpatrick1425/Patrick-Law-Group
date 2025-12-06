
import React, { useState, useEffect } from 'react';
import { CheckCircle, RefreshCw, Loader2 } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, userAnswer: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    regenerateCaptcha();
  }, []);

  const regenerateCaptcha = () => {
    setCaptcha({
      num1: Math.floor(Math.random() * 10),
      num2: Math.floor(Math.random() * 10),
      userAnswer: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Captcha
    if (parseInt(captcha.userAnswer) !== captcha.num1 + captcha.num2) {
      alert('Incorrect CAPTCHA answer. Please try again.');
      regenerateCaptcha();
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
        setFormStatus('success');
        setIsSubmitting(false);
    }, 1000);
  };

  if (formStatus === 'success') {
    return (
        <div className="bg-green-50 text-green-800 p-8 rounded-lg text-center animate-in fade-in zoom-in h-full flex flex-col items-center justify-center">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
          <h4 className="font-bold text-lg">Request Received</h4>
          <p className="mt-2 text-sm">We will be in touch within 24 hours.</p>
          <button onClick={() => setFormStatus('idle')} className="mt-6 text-sm underline text-green-700">Send another request</button>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
      <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
            <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-accent-500 outline-none transition" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
            <input required type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-accent-500 outline-none transition" placeholder="(555) 123-4567" />
          </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
        <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-accent-500 outline-none transition" placeholder="john@example.com" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Practice Area</label>
        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-accent-500 outline-none transition text-slate-700">
          <option>Business Law</option>
          <option>Corporate Law</option>
          <option>Intellectual Property</option>
          <option>Personal Injury</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Message</label>
        <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-accent-500 outline-none transition resize-none" placeholder="Brief details about your case..."></textarea>
      </div>
      
      {/* Captcha */}
      <div className="bg-slate-50 p-3 rounded border border-slate-200">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Security Check: {captcha.num1} + {captcha.num2} = ?</label>
        <div className="flex gap-2">
            <input 
                required 
                type="number" 
                className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-accent-500 outline-none transition" 
                placeholder="Answer"
                value={captcha.userAnswer}
                onChange={(e) => setCaptcha({...captcha, userAnswer: e.target.value})}
            />
            <button type="button" onClick={regenerateCaptcha} className="p-2 text-slate-400 hover:text-accent-600" title="Get new code">
                <RefreshCw size={20} />
            </button>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-accent-600 hover:bg-accent-500 text-white font-bold rounded shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {isSubmitting ? (
            <>
                <Loader2 size={18} className="animate-spin" /> Submitting...
            </>
        ) : (
            "Submit Request"
        )}
      </button>
    </form>
  );
};
