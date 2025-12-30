
import React, { useState, useEffect } from 'react';
import { Menu, X, Scale } from 'lucide-react';

interface HeaderProps {
    onNavigate: (section: string) => void;
    onSchedule: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onSchedule }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    // Observe relevant sections
    const sections = document.querySelectorAll('section[id], footer[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
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
    { name: 'Home', href: '#', id: 'home' },
    { name: 'About Us', href: 'about-page', id: 'about' },
    { name: 'Practice Areas', href: '#practice', id: 'practice' },
    { name: 'Results', href: '#results', id: 'results' },
    { name: 'Attorneys', href: '#attorneys', id: 'attorneys' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" onClick={(e) => handleLinkClick(e, '#')} className="flex items-center gap-2 group">
          <Scale className={`w-8 h-8 transition-colors duration-300 ${isScrolled ? 'text-accent-600' : 'text-white drop-shadow-md'}`} />
          <span className={`text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-navy-900' : 'text-white drop-shadow-md'}`}>
            Patrick Law Firm
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id && link.href !== 'about-page';
            
            return (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-sm transition-all duration-300 relative py-1 ${
                    isActive 
                    ? 'text-accent-500 font-bold' 
                    : isScrolled ? 'text-slate-600 font-medium hover:text-accent-600' : 'text-white/90 font-medium hover:text-white drop-shadow-sm'
                }`}
              >
                {link.name}
                {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-500 rounded-full animate-in fade-in zoom-in"></span>
                )}
              </a>
            );
          })}
          <button 
            onClick={onSchedule}
            className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 ${
              isScrolled 
                ? 'bg-navy-900 text-white hover:bg-navy-800' 
                : 'bg-white text-navy-900 hover:bg-accent-500 hover:text-white'
            }`}
          >
            Schedule Consultation
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button className={`md:hidden transition-colors ${isScrolled ? 'text-navy-900' : 'text-white'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl py-8 px-6 flex flex-col gap-5 animate-in slide-in-from-top-5">
           {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`text-lg font-bold transition-colors ${activeSection === link.id ? 'text-accent-600' : 'text-navy-900 hover:text-accent-600'}`}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => { setMobileMenuOpen(false); onSchedule(); }}
            className="mt-4 w-full text-center px-5 py-4 bg-navy-900 text-white font-bold rounded-xl shadow-lg"
          >
            Schedule Consultation
          </button>
        </div>
      )}
    </header>
  );
};
