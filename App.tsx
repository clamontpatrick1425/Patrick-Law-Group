
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PracticeAreas, ValueProp, Testimonials, Team, RecentVictories, FAQSection } from './components/Features';
import { Footer } from './components/Footer';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { AttorneyProfile } from './components/AttorneyProfile';
import { CaseResultsPage } from './components/CaseResultsPage';
import { AboutPage } from './components/AboutPage';
import { PracticeAreaPage } from './components/PracticeAreaPage';
import { Breadcrumbs } from './components/Breadcrumbs';
import { DisclaimerModal, TermsModal, PrivacyPolicyModal } from './components/LegalModals';
import { ContactModal } from './components/ContactModal';
import { Attorney, CaseResult } from './types';

// Mock Data
const ATTORNEYS: Attorney[] = [
    { 
        id: '1', 
        name: "Sarah Jenkins", 
        role: "Managing Partner", 
        bio: "Specializing in complex corporate mergers and high-stakes business litigation with over 20 years of experience.",
        imageUrl: "https://picsum.photos/id/64/300/300",
        practiceAreas: ["Corporate Law", "Mergers & Acquisitions", "Business Litigation"],
        education: ["J.D., Harvard Law School", "B.A. Economics, Yale University"],
        email: "sarah.jenkins@patricklaw.com",
        phone: "(816) 555-1212",
        fullBio: [
            "Sarah Jenkins is the Managing Partner at Patrick Law Firm, where she leads the firm's Corporate Law division. With over two decades of legal experience, Sarah has cultivated a reputation as a fierce negotiator and a strategic advisor to Fortune 500 companies.",
            "Before founding Patrick Law Firm, Sarah served as senior counsel for a major international financial institution. Her expertise lies in navigating complex regulatory environments and facilitating seamless mergers and acquisitions. She has successfully overseen transactions valued at over $2 billion combined.",
            "Sarah is frequently invited to speak at national legal conferences regarding corporate governance and ethics. When she isn't in the boardroom, she serves on the board of several non-profit organizations dedicated to economic development."
        ]
    },
    { 
        id: '2', 
        name: "Michael Ross", 
        role: "Senior Partner", 
        bio: "A relentless advocate for personal injury victims, securing millions in settlements for clients across the state.",
        imageUrl: "https://picsum.photos/id/91/300/300",
        practiceAreas: ["Personal Injury", "Wrongful Death", "Product Liability"],
        education: ["J.D., Columbia Law School", "B.A. Political Science, Duke University"],
        email: "michael.ross@patricklaw.com",
        phone: "(816) 555-1212",
        fullBio: [
            "Michael Ross brings a passion for justice to every case he handles. As a Senior Partner specializing in Personal Injury, Michael is dedicated to giving a voice to those who have been silenced or wronged by powerful entities.",
            "Throughout his 15-year career, Michael has secured multiple seven-figure verdicts for his clients. He is known for his meticulous preparation and his ability to break down complex medical and technical concepts for juries. His approach is client-centered, ensuring that every individual he represents feels heard and supported throughout the legal process.",
            "Michael is a member of the Multi-Million Dollar Advocates Forum, a distinction held by fewer than 1% of U.S. lawyers."
        ]
    },
    { 
        id: '3', 
        name: "Jessica Chen", 
        role: "Associate", 
        bio: "Expert in Intellectual Property law, helping innovators protect their digital assets and creative works.",
        imageUrl: "https://picsum.photos/id/65/300/300",
        practiceAreas: ["Intellectual Property", "Patent Law", "Trademark Litigation"],
        education: ["J.D., Stanford Law School", "B.S. Computer Science, MIT"],
        email: "jessica.chen@patricklaw.com",
        phone: "(816) 555-1212",
        fullBio: [
            "Jessica Chen is a rising star in the field of Intellectual Property Law. With a unique background in Computer Science from MIT, Jessica possesses the technical literacy required to understand complex software and engineering patents.",
            "She advises tech startups and established software companies on portfolio management, patent prosecution, and trademark enforcement. Jessica has successfully defended clients in high-profile copyright infringement cases involving digital media and open-source software.",
            "Jessica is passionate about the intersection of law and technology and actively writes about the legal implications of Artificial Intelligence."
        ]
    }
];

const CASE_RESULTS: CaseResult[] = [
    {
        id: '1',
        title: "Tech Startup Acquisition Dispute",
        practiceArea: "Corporate Law",
        description: "Represented a software startup during a hostile takeover attempt.",
        outcome: "Settlement in Client's Favor",
        amount: "$42 Million",
        challenge: "Our client was facing a hostile takeover bid from a major conglomerate that undervalued their proprietary technology and threatened to dissolve the founding team. The aggressor utilized complex offshore shell companies to obscure their accumulation of shares.",
        strategy: "We implemented a 'poison pill' shareholder rights plan and simultaneously launched a counter-investigation into the aggressor's previous M&A activities, revealing regulatory non-compliance. This leverage forced them to the negotiating table.",
        duration: "6 Months"
    },
    {
        id: '2',
        title: "Medical Device Malfunction",
        practiceArea: "Personal Injury",
        description: "Client suffered severe long-term health effects due to a defective implant.",
        outcome: "Jury Verdict",
        amount: "$8.5 Million",
        challenge: "The defendant, a multinational pharmaceutical company, argued that the client's complications were due to pre-existing conditions, supported by a team of 20 corporate defense attorneys.",
        strategy: "We employed advanced 3D medical imaging and retained world-class independent pathologists to conclusively prove the device's material degradation directly caused the tissue damage, dismantling the defense's causation argument.",
        duration: "2 Years"
    },
    {
        id: '3',
        title: "Trademark Infringement Defense",
        practiceArea: "Intellectual Property",
        description: "Defended a mid-sized e-commerce brand against a baseless suit.",
        outcome: "Case Dismissed with Prejudice",
        amount: "Fees Recovered",
        challenge: "A global retail giant filed a trademark infringement lawsuit against our client, aiming to drain their resources and force a rebrand, despite the markets being completely distinct.",
        strategy: "We executed an aggressive discovery process that uncovered internal communications proving the plaintiff knew there was no consumer confusion. We filed for summary judgment based on this bad faith evidence.",
        duration: "14 Months"
    },
    {
        id: '4',
        title: "Construction Accident Liability",
        practiceArea: "Personal Injury",
        description: "Construction worker fell from unsafe scaffolding.",
        outcome: "Pre-trial Settlement",
        amount: "$2.1 Million",
        challenge: "The General Contractor denied liability, claiming the subcontractor was solely responsible for safety protocols, creating a liability loop that left the injured worker without recourse.",
        strategy: "By analyzing site logs and daily reports, we proved the General Contractor explicitly directed the specific unsafe work practices that led to the accident, piercing their liability shield.",
        duration: "18 Months"
    },
    {
        id: '5',
        title: "Breach of Contract - Supply Chain",
        practiceArea: "Business Law",
        description: "Manufacturing firm faced bankruptcy due to supplier failure.",
        outcome: "Arbitration Award",
        amount: "$3.4 Million",
        challenge: "A key supplier failed to deliver critical components during peak season, citing 'force majeure' due to raw material shortages, threatening our client's solvency.",
        strategy: "We demonstrated through forensic accounting and supply chain tracking that the supplier had actually diverted materials to a higher-paying competitor, invalidating their force majeure claim.",
        duration: "3 Weeks"
    }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'attorney' | 'results' | 'about' | 'practice'>('home');
  const [selectedAttorneyId, setSelectedAttorneyId] = useState<string | null>(null);
  const [selectedPracticeId, setSelectedPracticeId] = useState<string | null>(null);
  
  // Modal State
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isAIWidgetOpen, setIsAIWidgetOpen] = useState(false);
  const [aiWidgetTab, setAiWidgetTab] = useState<'chat' | 'voice'>('chat');

  // Dynamic Title Management
  useEffect(() => {
    let title = "Patrick Law Firm - Strategic Legal Protection";
    
    if (currentView === 'about') {
        title = "About Us - Patrick Law Firm";
    } else if (currentView === 'results') {
        title = "Case Results - Patrick Law Firm";
    } else if (currentView === 'attorney' && selectedAttorneyId) {
        const attorney = ATTORNEYS.find(a => a.id === selectedAttorneyId);
        if (attorney) title = `${attorney.name} - Attorney Profile`;
    } else if (currentView === 'practice' && selectedPracticeId) {
        // Formatter for practice id to Title Case
        const pTitle = selectedPracticeId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        title = `${pTitle} - Patrick Law Firm`;
    }

    document.title = title;
  }, [currentView, selectedAttorneyId, selectedPracticeId]);

  const handleNavigate = (section: string) => {
      if (section === 'about') {
          setCurrentView('about');
      } else {
          setCurrentView('home');
      }
  };

  const handleSelectAttorney = (id: string) => {
      setSelectedAttorneyId(id);
      setCurrentView('attorney');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewResults = () => {
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewPracticeArea = (id: string) => {
      setSelectedPracticeId(id);
      setCurrentView('practice');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContact = () => setShowContactModal(true);

  const handleOpenVoiceAI = () => {
    setAiWidgetTab('voice');
    setIsAIWidgetOpen(true);
  };

  const handleToggleAIWidget = () => {
    if (!isAIWidgetOpen) {
        setAiWidgetTab('chat'); // Default to chat when clicking the side tab
    }
    setIsAIWidgetOpen(!isAIWidgetOpen);
  };

  // Content Renderer with Wrapper for Breadcrumbs
  const renderContent = () => {
      if (currentView === 'attorney' && selectedAttorneyId) {
          const attorney = ATTORNEYS.find(a => a.id === selectedAttorneyId);
          if (attorney) {
              return (
                  <div className="pt-24 min-h-screen bg-slate-50">
                      <div className="container mx-auto px-6 pt-4">
                        <Breadcrumbs items={[
                            { label: 'Home', onClick: () => setCurrentView('home') },
                            { label: 'Attorneys', onClick: () => { setCurrentView('home'); setTimeout(() => document.getElementById('attorneys')?.scrollIntoView(), 100); } },
                            { label: attorney.name }
                        ]} />
                      </div>
                      <AttorneyProfile attorney={attorney} onBack={() => setCurrentView('home')} onSchedule={handleOpenContact} />
                  </div>
              );
          }
      }

      if (currentView === 'results') {
          return (
            <div className="pt-24 min-h-screen bg-slate-50">
                <div className="container mx-auto px-6 pt-4">
                  <Breadcrumbs items={[
                      { label: 'Home', onClick: () => setCurrentView('home') },
                      { label: 'Case Results' }
                  ]} />
                </div>
                <CaseResultsPage results={CASE_RESULTS} onBack={() => setCurrentView('home')} />
            </div>
          );
      }

      if (currentView === 'about') {
          return (
            <div className="pt-24 min-h-screen bg-slate-50">
                <div className="container mx-auto px-6 pt-4">
                  <Breadcrumbs items={[
                      { label: 'Home', onClick: () => setCurrentView('home') },
                      { label: 'About Us' }
                  ]} />
                </div>
                <AboutPage onBack={() => setCurrentView('home')} onSchedule={handleOpenContact} />
            </div>
          );
      }

      if (currentView === 'practice' && selectedPracticeId) {
          const pTitle = selectedPracticeId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          return (
            <div className="pt-24 min-h-screen bg-slate-50">
                <div className="container mx-auto px-6 pt-4">
                  <Breadcrumbs items={[
                      { label: 'Home', onClick: () => setCurrentView('home') },
                      { label: 'Practice Areas', onClick: () => { setCurrentView('home'); setTimeout(() => document.getElementById('practice')?.scrollIntoView(), 100); } },
                      { label: pTitle }
                  ]} />
                </div>
                <PracticeAreaPage areaId={selectedPracticeId} onBack={() => setCurrentView('home')} onSchedule={handleOpenContact} />
            </div>
          );
      }

      // Default Home View
      return (
        <main>
            <Hero onOpenAI={handleOpenVoiceAI} />
            <RecentVictories results={CASE_RESULTS} onViewAll={handleViewResults} />
            <PracticeAreas onViewArea={handleViewPracticeArea} />
            <ValueProp />
            <Team attorneys={ATTORNEYS} onSelectAttorney={handleSelectAttorney} />
            <Testimonials onViewAllResults={handleViewResults} />
            <FAQSection />
        </main>
      );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-accent-200 selection:text-navy-900">
      <Header onNavigate={handleNavigate} onSchedule={handleOpenContact} />
      
      {renderContent()}

      <Footer 
        onOpenDisclaimer={() => setShowDisclaimer(true)} 
        onOpenTerms={() => setShowTerms(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
        onSchedule={handleOpenContact}
      />
      <AIAssistantWidget 
        isOpen={isAIWidgetOpen} 
        onToggle={handleToggleAIWidget} 
        initialTab={aiWidgetTab}
      />

      {/* Modals */}
      <DisclaimerModal isOpen={showDisclaimer} onClose={() => setShowDisclaimer(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
};

export default App;
