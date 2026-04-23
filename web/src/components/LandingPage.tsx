"use client"
import React from 'react';
import Header from './Header';
import Hero from './Hero';
import ValueProposition from './ValueProposition';
import Process from './Process';
import CTASection from './CTASection';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  const features = [
    {
      title: "AI-Powered Screening",
      description: "Automatically rank candidates using advanced skill-matching algorithms.",
      icon: "🤖",
    },
    {
      title: "Global Reach",
      description: "Access a diverse pool of talent from UAE, Europe, and beyond.",
      icon: "🌍",
    },
    {
      title: "Seamless Workflow",
      description: "Manage your entire recruitment pipeline in one centralized dashboard.",
      icon: "🚀",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Post a Position",
      description: "Create detailed job listings with specific skill and location requirements.",
    },
    {
      number: "2",
      title: "AI Matching",
      description: "Our engine scans incoming applications and scores them instantly.",
    },
    {
      number: "3",
      title: "Hire Faster",
      description: "Review shortlisted candidates and close your positions with confidence.",
    },
  ];

  const handleCtaClick = () => {
    console.log("CTA Clicked: Redirecting to application funnel...");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Eurovanta Talent" />
      
      <main className="flex-1">
        <Hero 
          headline="Revolutionize Your Global Recruitment"
          subheadline="Connect with top-tier talent across borders using our intelligent, data-driven hiring platform."
          ctaText="Get Started Now"
          onCtaClick={handleCtaClick}
        />
        
        <ValueProposition features={features} />
        
        <Process steps={steps} />
        
        <CTASection 
          title="Ready to transform your hiring?"
          subtitle="Join hundreds of companies scaling their teams with Eurovanta Talent's intelligent platform."
          buttonText="Create Your Account"
          onButtonClick={handleCtaClick}
        />
      </main>

      <Footer copyright="© 2026 Eurovanta Talent. All rights reserved." />
    </div >
  );
};

export default LandingPage;
