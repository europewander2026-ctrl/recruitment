"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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
                    <Image src="/logo.png" alt="Eurovanta Talent Logo" width={120} height={32} priority className="object-contain" />
                </Link>
                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
                    <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
                    <a href="#process" className="hover:text-primary transition-colors">How it Works</a>
                    <Link href="/verify" className="hover:text-primary transition-colors">Verify Document</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/verify" className="hidden md:block text-sm font-bold text-primary hover:text-blue-700 transition-colors">
                        Verify Document
                    </Link>
                    <Link href="/login" className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/30 transition-all">
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
                            Next-Gen Recruitment
                        </div>
                        <h1 className="font-heading font-bold text-5xl lg:text-7xl text-darkBlue leading-tight mb-6 tracking-tight">
                            Seamless Global <br className="hidden lg:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Recruitment</span>
                        </h1>
                        <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Connecting world-class talent with premier global opportunities. Transparent, verified, and borderless placement for the modern workforce.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link href="/verify" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-full shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all">
                                Verify Official Document
                            </Link>
                            <a href="#process" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
                                See How It Works
                            </a>
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
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <h3 className="font-bold text-xl text-darkBlue mb-3">Verified Placements</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Every candidate and employer undergoes strict verification. We ensure authenticity, completely eliminating fraud and building mutual trust.
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                            <i className="fa-solid fa-globe"></i>
                        </div>
                        <h3 className="font-bold text-xl text-darkBlue mb-3">Global Reach</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Access a truly borderless talent pool. We connect high-demand sectors across Europe and the Middle East with highly skilled global professionals.
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                            <i className="fa-solid fa-file-shield"></i>
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
                    <p className="text-slate-500 leading-relaxed">A perfectly transparent, three-step linear process designed to secure your global career flawlessly.</p>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 relative">
                    
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-gradient-to-r from-slate-200 via-primary to-slate-200 rounded-full z-0"></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-xs w-full">
                        <div className="w-24 h-24 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-4 border-slate-50 flex items-center justify-center text-3xl text-slate-400 mb-6 transition-colors hover:border-primary hover:text-primary">
                            1
                        </div>
                        <h4 className="font-bold text-lg text-darkBlue mb-2">Apply & Interview</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Submit your detailed profile and undergo our rigorous technical screening and interview process.</p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-xs w-full">
                        <div className="w-24 h-24 bg-primary rounded-full shadow-[0_10px_30px_rgba(13,95,183,0.3)] border-4 border-blue-100 flex items-center justify-center text-3xl text-white mb-6">
                            2
                        </div>
                        <h4 className="font-bold text-lg text-darkBlue mb-2">Get Verified</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Your professional documents and global credentials are cryptographically verified and securely stored.</p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-xs w-full">
                        <div className="w-24 h-24 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-4 border-slate-50 flex items-center justify-center text-3xl text-slate-400 mb-6 transition-colors hover:border-primary hover:text-primary">
                            3
                        </div>
                        <h4 className="font-bold text-lg text-darkBlue mb-2">Receive Offer</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Accept your official digital offer letter and automatically begin your seamless relocation journey.</p>
                    </div>
                </div>
             </div>
        </section>

        {/* Task 1.5: Trust & Conversion */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="bg-darkBlue rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(13,95,183,0.2)]">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"></div>
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full filter blur-[80px] pointer-events-none"></div>
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/30 rounded-full filter blur-[80px] pointer-events-none"></div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white mb-6 tracking-tight">Ready to verify an official document?</h2>
                        <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
                            Our public portal allows you to instantly verify the authenticity and status of any Eurovanta Talent offer letter or contract.
                        </p>
                        <Link href="/verify" className="inline-block px-10 py-5 bg-white text-darkBlue font-bold rounded-full text-lg shadow-xl hover:scale-105 hover:shadow-2xl hover:shadow-white/20 transition-all">
                            Access Verification Portal
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        {/* Task 1.1: Global Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <Link href="/" className="font-heading font-bold text-2xl tracking-tight text-darkBlue">
                        <Image src="/logo.png" alt="Eurovanta Talent Logo" width={120} height={32} className="object-contain" />
                    </Link>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
                    </div>
                </div>
                <div className="text-center text-sm text-slate-400 border-t border-slate-200 pt-8">
                    &copy; {new Date().getFullYear()} Eurovanta Talent Talent Solutions. All rights reserved.
                </div>
            </div>
        </footer>
    </div>
  );
}
