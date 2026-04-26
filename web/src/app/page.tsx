"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { ShieldCheck, Globe, FileLock } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [config, setConfig] = useState<any>({
      home_hero_text: "Work in Europe.",
      home_hero_highlight: "Live Your Potential.",
      home_journey_text: "A perfectly transparent, three-step linear process designed to secure your global career flawlessly.",
      home_fraud_warning: "Fraudsters sometimes impersonate recruitment agencies. Eurovanta Talent will NEVER ask for payment before you receive a verified offer letter, contact you through WhatsApp as official communication, or issue letters for Hungary or Croatia (both programmes are permanently closed)."
  });

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
          if (data.success && data.data) {
              const newConfig = {
                  home_hero_text: "Work in Europe.",
                  home_hero_highlight: "Live Your Potential.",
                  home_journey_text: "A perfectly transparent, three-step linear process designed to secure your global career flawlessly.",
                  home_fraud_warning: "Fraudsters sometimes impersonate recruitment agencies. Eurovanta Talent will NEVER ask for payment before you receive a verified offer letter, contact you through WhatsApp as official communication, or issue letters for Hungary or Croatia (both programmes are permanently closed)."
              };
              data.data.forEach((item: any) => {
                  newConfig[item.key as keyof typeof newConfig] = item.value;
              });
              setConfig(newConfig);
          }
      })
      .catch(err => console.error("Error fetching config", err));
      
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#f8f9fa] text-slate-800 font-sans overflow-x-hidden">
        <Head>
            <title>Eurovanta Talent | Seamless Global Recruitment</title>
        </Head>

        {/* Task 1.1: Global Header */}
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 font-heading font-bold text-2xl tracking-tight text-darkBlue">
                    <Image src="/logo.png" alt="Eurovanta Talent Logo" width={220} height={55} priority className="object-contain" />
                </Link>
                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/jobs" className="hover:text-primary transition-colors">Available Positions</Link>
                    <Link href="/verify" className="hover:text-primary transition-colors">Verify Your Letter</Link>
                    <Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/verify" className="hidden md:block text-sm font-bold text-[#002366] hover:text-amber-500 transition-colors">
                        Verify Document
                    </Link>
                    <Link href="/login" className="font-bold bg-[#002366] text-white hover:bg-blue-900 px-5 py-2.5 rounded-full text-sm shadow-lg shadow-blue-500/30 transition-all">
                        Admin Login
                    </Link>
                </div>
            </div>
        </header>

        {/* Task 1.2: Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-slate-50 -z-10"></div>
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full filter blur-[100px] -z-10"></div>
            <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-green-500/5 rounded-full filter blur-[100px] -z-10"></div>

            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 text-center lg:text-left z-10">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary font-bold text-xs uppercase tracking-widest mb-6 shadow-sm">
                            Trusted European Recruitment Agency
                        </div>
                        <h1 className="font-heading font-bold text-5xl lg:text-7xl text-darkBlue leading-tight mb-6 tracking-tight">
                            {config.home_hero_text} <br className="hidden lg:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{config.home_hero_highlight}</span>
                        </h1>
                        <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Eurovanta Talent connects skilled professionals with verified employers across Europe. From Poland to Latvia, we place real people in real jobs — with full documentation, legal support, and a transparent process from application to arrival.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                            <Link href="#jobs" className="w-full sm:w-auto px-8 py-4 bg-brandNavy hover:bg-blue-900 text-white hover:text-brandGold font-bold rounded-full shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all">
                                Browse Open Positions
                            </Link>
                            <Link href="/verify" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
                                Verify Your Offer Letter
                            </Link>
                        </div>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-bold text-slate-400">
                            <span>✦ Legally Registered</span>
                            <span>✦ EU-Compliant Contracts</span>
                            <span>✦ Document-Verified</span>
                            <span>✦ GDPR Compliant</span>
                        </div>
                    </div>
                    
                    {/* Abstract UI Graphic / Glassmorphism Concept */}
                    <div className="lg:w-1/2 relative w-full max-w-lg mx-auto lg:mx-0">
                        <div className="relative z-10 bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] p-6 transform hover:scale-[1.02] transition-transform duration-500">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-primary flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-darkBlue text-sm">Verified Candidate</h4>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">ID: ET-2026-X91</p>
                                </div>
                                <span className="ml-auto bg-green-100 text-green-600 text-[0.65rem] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-green-200">Approved</span>
                            </div>
                            <div className="space-y-3 px-2">
                                <div className="h-2 w-3/4 bg-slate-200 rounded-full"></div>
                                <div className="h-2 w-1/2 bg-slate-200 rounded-full"></div>
                                <div className="h-2 w-5/6 bg-slate-200 rounded-full"></div>
                            </div>
                            <div className="mt-6 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-100">
                                <div>
                                    <p className="text-[0.65rem] uppercase tracking-widest text-primary font-bold mb-1">Deployment Status</p>
                                    <p className="text-sm font-bold text-darkBlue">Ready for Relocation</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-blue-100 text-primary">
                                    <i className="fa-solid fa-plane"></i>
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative floating elements */}
                        <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-slate-100 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 shadow-sm"><i className="fa-solid fa-shield-check"></i></div>
                                <div>
                                    <p className="text-xs font-bold text-slate-700">100% Cryptographic Security</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-300 to-primary rounded-full filter blur-[30px] opacity-40 z-0"></div>
                    </div>
                </div>
            </div>
        </section>

        {/* Task 1.3: Value Proposition Section */}
        <section id="benefits" className="py-24 bg-white relative border-y border-slate-100">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="font-heading font-bold text-3xl lg:text-4xl text-darkBlue mb-4">Why Choose Eurovanta Talent?</h2>
                    <p className="text-slate-500 leading-relaxed">We streamline the complexities of international recruitment, providing a safe, verified, and highly efficient bridge between premier talent and leading global employers.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-brandNavy transition-colors">
                            <ShieldCheck className="w-10 h-10 text-brandNavy group-hover:text-brandGold transition-colors" />
                        </div>
                        <h3 className="font-bold text-xl text-darkBlue mb-3">Verified Placements</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Every candidate and employer undergoes strict verification. We ensure authenticity, completely eliminating fraud and building mutual trust.
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-brandNavy transition-colors">
                            <Globe className="w-10 h-10 text-brandNavy group-hover:text-brandGold transition-colors" />
                        </div>
                        <h3 className="font-bold text-xl text-darkBlue mb-3">Global Reach</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Access a truly borderless talent pool. We connect high-demand sectors across Europe and the Middle East with highly skilled global professionals.
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-brandNavy transition-colors">
                            <FileLock className="w-10 h-10 text-brandNavy group-hover:text-brandGold transition-colors" />
                        </div>
                        <h3 className="font-bold text-xl text-darkBlue mb-3">Secure Documents</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Our proprietary document portal allows instant verification of official offer letters and contracts with cryptographic, immutable certainty.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Task 1.4: Process / How It Works */}
        <section id="process" className="py-24 bg-slate-50 relative overflow-hidden">
             {/* Decorative Background grid */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
             
             <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="font-heading font-bold text-3xl lg:text-4xl text-darkBlue mb-4">The Candidate Journey</h2>
                    <p className="text-slate-500 leading-relaxed">{config.home_journey_text}</p>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 relative">
                    
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-gradient-to-r from-slate-200 via-primary to-slate-200 rounded-full z-0"></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-xs w-full">
                        <div className="w-24 h-24 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-4 border-slate-50 flex items-center justify-center text-3xl text-slate-400 mb-6 transition-colors hover:border-primary hover:text-primary">
                            1
                        </div>
                        <h4 className="font-bold text-lg text-darkBlue mb-2">Browse & Apply</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Choose a position that matches your skills. Submit your application through our secure online form. No agents, no middlemen.</p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-xs w-full">
                        <div className="w-24 h-24 bg-primary rounded-full shadow-[0_10px_30px_rgba(13,95,183,0.3)] border-4 border-blue-100 flex items-center justify-center text-3xl text-white mb-6">
                            2
                        </div>
                        <h4 className="font-bold text-lg text-darkBlue mb-2">Review & Selection</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Our team reviews your application carefully. Shortlisted candidates are contacted directly for assessment through official channels.</p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-xs w-full">
                        <div className="w-24 h-24 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-4 border-slate-50 flex items-center justify-center text-3xl text-slate-400 mb-6 transition-colors hover:border-primary hover:text-primary">
                            3
                        </div>
                        <h4 className="font-bold text-lg text-darkBlue mb-2">Receive Your Letter</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Successful candidates receive an official Letter containing a unique verification code to download securely.</p>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-xs w-full mt-12 md:mt-0">
                        <div className="w-24 h-24 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-4 border-slate-50 flex items-center justify-center text-3xl text-slate-400 mb-6 transition-colors hover:border-primary hover:text-primary">
                            4
                        </div>
                        <h4 className="font-bold text-lg text-darkBlue mb-2">Verify & Download</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Log into our secure portal to verify your documents and download your official paperwork instantly.</p>
                    </div>

                    {/* Step 5 */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-xs w-full mt-12 md:mt-0">
                        <div className="w-24 h-24 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-4 border-slate-50 flex items-center justify-center text-3xl text-slate-400 mb-6 transition-colors hover:border-primary hover:text-primary">
                            5
                        </div>
                        <h4 className="font-bold text-lg text-darkBlue mb-2">Travel & Work</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Arrive at your destination fully prepared with our ongoing support to begin your new career in Europe.</p>
                    </div>
                </div>
             </div>
        </section>

        {/* Task 1.5: Trust & Conversion & Fraud Warning */}
        {/* Task 2: Active Placements Section */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="font-heading font-bold text-3xl lg:text-4xl text-[#002366] mb-4">Where We Place People Right Now</h2>
                    <p className="text-slate-500 leading-relaxed">Explore our active recruitment corridors across Europe.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {[
                        { name: "Poland", ind: "Manufacturing, IT, Logistics", contract: "1-3 Years", acc: "Provided" },
                        { name: "Czech Republic", ind: "Automotive, Healthcare", contract: "1-2 Years", acc: "Assisted" },
                        { name: "Serbia", ind: "Construction, Logistics", contract: "1 Year", acc: "Provided" },
                        { name: "Lithuania", ind: "Transport, Logistics", contract: "2 Years", acc: "Assisted" },
                        { name: "Latvia", ind: "Agriculture, Production", contract: "Seasonal / 1 Year", acc: "Provided" }
                    ].map(country => (
                        <div key={country.name} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[#002366]">{country.name}</h3>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">🟢 Actively Recruiting</span>
                            </div>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li><strong className="text-slate-800">Industries:</strong> {country.ind}</li>
                                <li><strong className="text-slate-800">Contract Type:</strong> {country.contract}</li>
                                <li><strong className="text-slate-800">Accommodation:</strong> {country.acc}</li>
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center max-w-4xl mx-auto">
                    <p className="text-amber-800 text-sm font-medium">
                        <strong>⚠️ Important Notice:</strong> The Hungary and Croatia recruitment programs are currently permanently closed. Eurovanta Talent is not issuing letters for these regions.
                    </p>
                </div>
            </div>
        </section>

        {/* Task 1.5: Trust & Conversion & Fraud Warning */}
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="bg-red-50 border border-red-100 rounded-3xl p-10 mb-16 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-3xl flex-shrink-0">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-red-700 mb-4">Protect Yourself from Fraud</h3>
                            <p className="text-slate-700 text-sm mb-3"><strong>Eurovanta Talent will NEVER:</strong></p>
                            <ul className="list-disc list-inside text-slate-600 text-sm leading-relaxed mb-6 space-y-2">
                                <li>Ask for upfront payment before you receive a verified offer letter.</li>
                                <li>Contact you through WhatsApp as an official communication channel.</li>
                                <li>Issue letters for Hungary or Croatia (both programmes are permanently closed).</li>
                            </ul>
                            <p className="text-sm font-bold text-slate-700">If something does not feel right — stop and verify at <a href="mailto:verify@eurovantatalent.com" className="text-[#002366] hover:underline">verify@eurovantatalent.com</a></p>
                        </div>
                    </div>
                </div>

                <div className="bg-brandNavy rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(13,95,183,0.2)]">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"></div>
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full filter blur-[80px] pointer-events-none"></div>
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/30 rounded-full filter blur-[80px] pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white mb-6 tracking-tight">Ready to verify an official document?</h2>
                        <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
                            Our public portal allows you to instantly verify the authenticity and status of any Eurovanta Talent offer letter or contract.
                        </p>
                        <Link href="/verify" className="inline-block px-10 py-5 bg-brandNavy border border-white/20 text-white font-bold rounded-full text-lg shadow-xl hover:scale-105 hover:bg-blue-900 hover:text-brandGold hover:shadow-2xl hover:shadow-white/20 transition-all">
                            Access Verification Portal
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        {/* Task 1.9: Contact */}
        {/* Task 1.9: Contact */}
        <section id="contact" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="font-heading font-bold text-3xl lg:text-4xl text-[#002366] mb-4">Get in Touch</h2>
                    <p className="text-slate-500 leading-relaxed">Have a question about the process? Reach out to our dedicated support teams.</p>
                </div>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-[#002366] rounded-full flex items-center justify-center text-xl shrink-0"><i className="fa-solid fa-envelope"></i></div>
                            <div>
                                <h4 className="font-bold text-[#002366] mb-2">Email Directory</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><strong className="text-slate-700">General:</strong> <a href="mailto:info@eurovantatalent.com" className="text-slate-500 hover:text-[#002366]">info@eurovantatalent.com</a></li>
                                    <li><strong className="text-slate-700">Verification:</strong> <a href="mailto:verify@eurovantatalent.com" className="text-slate-500 hover:text-[#002366]">verify@eurovantatalent.com</a></li>
                                    <li><strong className="text-slate-700">Partners:</strong> <a href="mailto:partners@eurovantatalent.com" className="text-slate-500 hover:text-[#002366]">partners@eurovantatalent.com</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-[#002366] rounded-full flex items-center justify-center text-xl shrink-0"><i className="fa-solid fa-clock"></i></div>
                            <div>
                                <h4 className="font-bold text-[#002366] mb-2">Office Hours</h4>
                                <p className="text-slate-500 text-sm">Monday – Friday<br/>09:00 – 17:00 CET</p>
                                <p className="text-slate-500 text-sm mt-2"><strong className="text-slate-700">Response Time:</strong> 24-48 Hours</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Form) */}
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                                <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm">
                                    <option value="">Select a subject...</option>
                                    <option value="General Enquiry">General Enquiry</option>
                                    <option value="Application Status">Application Status</option>
                                    <option value="Verify a Letter">Verify a Letter</option>
                                    <option value="Report Fraud">Report Fraud</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                <textarea required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#002366] text-sm" placeholder="How can we help you?"></textarea>
                            </div>
                            <label className="flex items-start gap-3 text-sm text-slate-600">
                                <input required type="checkbox" className="mt-1 w-4 h-4 text-[#002366] rounded border-slate-300" />
                                <span>I agree to the Privacy Policy.</span>
                            </label>
                            <button type="submit" className="w-full py-4 bg-[#002366] hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg transition-all">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        {/* Global Footer */}
        <footer className="bg-brandNavy text-white border-t border-slate-200 pt-16 pb-8">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
                    <div className="text-center md:text-left">
                        <Link href="/" className="font-heading font-bold text-2xl tracking-tight text-white mb-4 block">
                            <Image src="/favicon.png" alt="Eurovanta Talent Logo" width={64} height={64} className="object-contain" />
                        </Link>
                        <p className="text-slate-300 text-sm mt-4 max-w-sm">Eurovanta Talent connects skilled professionals with verified employers across Europe and the Middle East.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-12 text-sm">
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Quick Links</h4>
                            <ul className="space-y-2 text-slate-300 font-medium">
                                <li><Link href="/" className="hover:text-brandGold transition-colors">Home</Link></li>
                                <li><Link href="/jobs" className="hover:text-brandGold transition-colors">Available Positions</Link></li>
                                <li><Link href="/jobs" className="hover:text-brandGold transition-colors">Apply Now</Link></li>
                                <li><Link href="/verify" className="hover:text-brandGold transition-colors">Verify Your Letter</Link></li>
                                <li><Link href="/#contact" className="hover:text-brandGold transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Legal</h4>
                            <ul className="space-y-2 text-slate-300 font-medium">
                                <li><Link href="/legal/privacy-policy" className="hover:text-brandGold transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/legal/terms-of-service" className="hover:text-brandGold transition-colors">Terms of Service</Link></li>
                                <li><Link href="/legal/cookie-policy" className="hover:text-brandGold transition-colors">Cookie Policy</Link></li>
                                <li><Link href="/legal/gdpr-policy" className="hover:text-brandGold transition-colors">GDPR Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-slate-400 max-w-4xl mx-auto mb-8">
                    <p>Eurovanta Talent is a registered recruitment agency operating in compliance with EU employment and data protection regulations. We do not charge placement fees. A document handling fee of €25 applies only after successful candidate selection and letter verification.</p>
                </div>

                <div className="text-center text-sm text-slate-400 border-t border-slate-700/50 pt-8">
                    &copy; {new Date().getFullYear()} Eurovanta Talent. All Rights Reserved.
                </div>
            </div>
        </footer>
    </div>
  );
}
