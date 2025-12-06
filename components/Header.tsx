
import React, { useState, useEffect } from 'react';
import { Menu, X, Scale } from 'lucide-react';

interface HeaderProps {
    onNavigate: (section: string) => void;
    onSchedule: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onSchedule }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      setMobileMenuOpen(false);
      
      if (href === 'about-page') {
          // Special handling for the full About page view
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onNavigate('about');
      } else if (href === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onNavigate('home');
      } else {
          // If navigating to a section, ensure we are on home view first
          onNavigate('home');
          // Wait a tick for view to render if we were on a sub-page
          setTimeout(() => {
              const element = document.querySelector(href);
              if (element) element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      }
  };

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About Us', href: 'about-page' }, // Updated href to trigger page view
    { name: 'Practice Areas', href: '#practice' },
    { name: 'Results', href: '#results' },
    { name: 'Attorneys', href: '#attorneys' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" onClick={(e) => handleLinkClick(e, '#')} className="flex items-center gap-2 group">
          <Scale className={`w-8 h-8 ${isScrolled ? 'text-accent-600' : 'text-navy-900 group-hover:text-accent-600 transition'}`} />
          <span className={`text-xl font-serif font-bold tracking-tight ${isScrolled ? 'text-navy-900' : 'text-navy-900'}`}>
            Patrick Law Firm
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-sm font-medium text-slate-600 hover:text-accent-600 transition"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={onSchedule}
            className="px-5 py-2.5 bg-navy-900 text-white text-sm font-medium rounded hover:bg-navy-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Schedule Consultation
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-navy-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
           {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-lg font-medium text-slate-800"
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => { setMobileMenuOpen(false); onSchedule(); }}
            className="mt-2 w-full text-center px-5 py-3 bg-navy-900 text-white font-medium rounded"
          >
            Schedule Consultation
          </button>
        </div>
      )}
    </header>
  );
};
