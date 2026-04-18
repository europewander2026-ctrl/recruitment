import React from 'react';

interface HeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  onCtaClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ headline, subheadline, ctaText, onCtaClick }) => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Minimalist Hero Visual/Shape */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accentBlue/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-8 text-center">
        <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-darkBlue leading-tight mb-6">
          {headline}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          {subheadline}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onCtaClick}
            className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95"
          >
            {ctaText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
