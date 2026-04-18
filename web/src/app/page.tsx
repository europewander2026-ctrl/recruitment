"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RecruitmentPage() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('uae');
  const [isScanning, setIsScanning] = useState(false);
  const [btnText, setBtnText] = useState('Initialize Transfer');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Reveal Animation
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // init

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const jobData = {
    portugal: ['Factory Workers', 'Drivers (Type C License)', 'Production Line'],
    denmark: ['Warehouse Workers'],
    germany: ['Logistics Warehouse Staff'],
    norway: ['Staff Warehouse (€3600)', 'Clothing Warehouse (€3100)'],
    hungary: ['Production Operation', 'Builders & Welders'],
    uae: ['White Collar Professionals', 'Blue Collar Labor']
  };

  const handleSelectCountry = (country: string) => {
    document.getElementById('application-portal')?.scrollIntoView({ behavior: 'smooth' });
    setSelectedCountry(country);
  };

  const submitApp = () => {
    setIsScanning(true);
    setBtnText("Scanning Biometrics...");
    
    setTimeout(() => {
        alert("Identity Verified. Application Transmitted.");
        setBtnText("Initialize Transfer");
        setIsScanning(false);
    }, 1500);
  };

  const isUae = selectedCountry === 'uae';

  return (
    <div className="text-gray-800 bg-[#f8f9fa]">
      {/* Header */}
      <header className={`fixed z-50 pill-header py-3 px-8 flex justify-between items-center ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="flex items-center gap-2 group">
          <img src="https://demo.hmhlabz.com/immihire/wp-content/uploads/immihire-logo.webp" alt="ImmiHire Logo" className="h-10 w-auto object-contain" />
          <span className="font-heading font-bold text-xl text-black tracking-tight">Immi<span className="text-primary">Hire</span></span>
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-[0.8rem] font-bold text-gray-700 tracking-widest uppercase">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <div className="nav-item group cursor-pointer">
              <span className="hover:text-primary transition-colors flex items-center gap-1">Services <i className="fa-solid fa-chevron-down text-[0.6rem]"></i></span>
              <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">USA Visit Visa</a>
                  <a href="#" className="dropdown-item">Canada Express Entry</a>
              </div>
          </div>
          <Link href="/login" className="text-primary transition-colors ml-4 bg-primary/10 px-4 py-2 rounded-full">Admin Login</Link>
        </nav>
      </header>

      {/* Holographic Job Matrix (Hero) */}
      <section className="matrix-section pt-20">
        <div className="matrix-grid"></div>
        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col items-center justify-center pt-24">
            <div className="text-center mb-20 reveal active relative z-20">
                <div className="inline-block px-3 py-1 rounded-full border border-green-500/50 bg-green-900/30 text-green-400 font-mono text-xs uppercase tracking-widest mb-4 backdrop-blur-sm animate-pulse">
                    ● Live Data Feed
                </div>
                <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-2 drop-shadow-[0_0_15px_rgba(0,255,65,0.5)]">
                    Global Talent Matrix
                </h1>
                <p className="text-gray-400 text-sm max-w-xl mx-auto">
                    Real-time positions available across our international network. <br/>Select a node to initiate deployment sequence.
                </p>
            </div>

            <div className="relative w-full h-[500px] perspective-container flex justify-center items-center gap-12 flex-wrap">
                {/* Portugal */}
                <div className="job-card-3d relative w-80 transform rotate-y-10">
                    <h3>Portugal</h3>
                    <p>STATUS: URGENT HIRING</p>
                    <ul>
                        {jobData.portugal.map(role => <li key={role}>{role}</li>)}
                    </ul>
                    <button onClick={() => handleSelectCountry('portugal')} className="mt-4 w-full py-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-black font-bold font-mono text-xs uppercase border border-green-500 transition-all">
                        Access Protocol
                    </button>
                </div>
                {/* UAE */}
                <div className="job-card-3d relative w-80 border-primary shadow-[0_0_20px_rgba(13,95,183,0.2)] transform -rotate-y-10">
                    <h3>UAE</h3>
                    <p className="text-primary">STATUS: OPEN</p>
                    <ul>
                        {jobData.uae.map(role => <li key={role}>{role}</li>)}
                    </ul>
                    <button onClick={() => handleSelectCountry('uae')} className="mt-4 w-full py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white font-bold font-mono text-xs uppercase border border-blue-500 transition-all">
                        Access Protocol
                    </button>
                </div>
                {/* Germany */}
                <div className="job-card-3d relative w-80 transform rotate-x-5 mt-10">
                    <h3>Germany</h3>
                    <p>STATUS: ACTIVE</p>
                    <ul>
                        {jobData.germany.map(role => <li key={role}>{role}</li>)}
                    </ul>
                    <button onClick={() => handleSelectCountry('germany')} className="mt-4 w-full py-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-black font-bold font-mono text-xs uppercase border border-green-500 transition-all">
                        Access Protocol
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Quantum Application Portal */}
      <section id="application-portal" className="py-24 bg-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="container mx-auto px-6 max-w-4xl relative z-10">
              <div className="portal-container reveal">
                  
                  <div className={`portal-header`} style={{ background: isUae ? 'linear-gradient(135deg, #000814 0%, #0d5fb7 100%)' : 'linear-gradient(135deg, #000814 0%, #10b981 100%)' }}>
                      <div className="scan-line"></div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                          <div>
                              <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                                  <h2 className="font-heading font-bold text-2xl tracking-tight">Application Terminal</h2>
                              </div>
                              <p className="text-white/60 text-xs mt-2 font-mono uppercase tracking-widest">{isUae ? 'UAE RECRUITMENT CHANNEL ACTIVE' : 'EUROPEAN WORK PERMIT PROTOCOL'}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-white/80 text-sm font-mono">TARGET: {isUae ? 'recruitment@immihire.com' : 'info@immihire.com'}</p>
                          </div>
                      </div>
                  </div>

                  <div className="p-8 md:p-12 bg-white">
                      <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                          
                          <div className="group relative">
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Destination Protocol</label>
                              <div className="relative">
                                  <select 
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:border-darkBlue transition-all font-bold text-darkBlue appearance-none cursor-pointer hover:bg-gray-100"
                                  >
                                      <option value="portugal">Portugal (Factory/Drivers)</option>
                                      <option value="denmark">Denmark (Warehouse)</option>
                                      <option value="germany">Germany (Logistics)</option>
                                      <option value="norway">Norway (Warehouse Staff)</option>
                                      <option value="hungary">Hungary (Production)</option>
                                      <option value="uae" className="text-primary font-bold">United Arab Emirates (Various)</option>
                                  </select>
                                  <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                              </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name *</label>
                                  <input type="text" className="w-full bg-white border-b-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition-all placeholder-gray-300 font-medium" placeholder="Enter Name" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contact Link *</label>
                                  <input type="tel" className="w-full bg-white border-b-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-primary transition-all placeholder-gray-300 font-medium" placeholder="+971..." />
                              </div>
                          </div>

                          {!isUae && (
                              <div className="dynamic-field">
                                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Financial Clearance (Budget) *</label>
                                  <div className="grid grid-cols-3 gap-4">
                                      <label className="cursor-pointer">
                                          <input type="radio" name="budget" className="peer sr-only" />
                                          <div className="p-4 border border-gray-200 rounded-xl text-center hover:bg-gray-50 peer-checked:bg-darkBlue peer-checked:text-white peer-checked:border-darkBlue transition-all">
                                              <span className="block text-sm font-bold">€3k - €5k</span>
                                          </div>
                                      </label>
                                      <label className="cursor-pointer">
                                          <input type="radio" name="budget" className="peer sr-only" />
                                          <div className="p-4 border border-gray-200 rounded-xl text-center hover:bg-gray-50 peer-checked:bg-darkBlue peer-checked:text-white peer-checked:border-darkBlue transition-all">
                                              <span className="block text-sm font-bold">€5k - €10k</span>
                                          </div>
                                      </label>
                                      <label className="cursor-pointer">
                                          <input type="radio" name="budget" className="peer sr-only" />
                                          <div className="p-4 border border-gray-200 rounded-xl text-center hover:bg-gray-50 peer-checked:bg-darkBlue peer-checked:text-white peer-checked:border-darkBlue transition-all">
                                              <span className="block text-sm font-bold">€10k+</span>
                                          </div>
                                      </label>
                                  </div>
                              </div>
                          )}

                          {isUae && (
                              <div className="dynamic-field">
                                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                      <h4 className="font-bold text-darkBlue mb-4 flex items-center gap-2"><i className="fa-solid fa-file-shield"></i> Document Verification</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                          <div className="upload-zone bg-white hover:border-primary group transition-all p-4 border border-gray-200 rounded-xl text-center cursor-pointer">
                                              <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-300 group-hover:text-primary mb-2 transition-colors"></i>
                                              <p className="text-xs font-bold text-gray-600">Upload Resume</p>
                                          </div>
                                          <div className="upload-zone bg-white hover:border-primary group transition-all p-4 border border-gray-200 rounded-xl text-center cursor-pointer">
                                              <i className="fa-regular fa-file-lines text-3xl text-gray-300 group-hover:text-primary mb-2 transition-colors"></i>
                                              <p className="text-xs font-bold text-gray-600">Cover Letter</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          <button type="button" onClick={submitApp} className="bio-btn w-full py-5 bg-darkBlue text-white font-bold rounded-xl hover:bg-black transition-all shadow-xl flex justify-center items-center gap-4 group relative overflow-hidden">
                              <span className="tracking-widest uppercase text-sm">{btnText}</span>
                              <i className={`fa-solid fa-fingerprint fingerprint-icon text-green-400 ${isScanning ? 'animate-pulse opacity-100' : ''}`}></i>
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000814] text-white pt-24 pb-12 mt-10 relative z-20 overflow-hidden rounded-t-[3rem]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse"></div>
          <div className="container mx-auto px-6 relative z-10">
              <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
                  <div className="md:w-1/2">
                      <h2 className="font-heading font-bold text-5xl md:text-7xl mb-6 leading-none tracking-tight">Ready to <br/><span className="text-primary">Fly?</span></h2>
                      <button className="px-8 py-4 bg-white text-darkBlue font-bold rounded-full text-lg hover:bg-gray-200 transition-colors">Book Consultation</button>
                  </div>
              </div>
              <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                  <p>&copy; 2026 ImmiHire Consultants. All Rights Reserved.</p>
              </div>
          </div>
      </footer>
    </div>
  );
}
