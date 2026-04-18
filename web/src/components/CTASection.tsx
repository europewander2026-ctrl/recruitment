import React from 'react';

interface CTAProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const CTASection: React.FC<CTAProps> = ({ title, subtitle, buttonText, onButtonClick }) => {
  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-darkBlue px-8 py-12 md:py-20 text-center shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accentBlue/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">
              {title}
            </h2>
            <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              {subtitle}
            </p>
            <button
              onClick={onButtonClick}
              className="bg-white text-darkBlue hover:bg-blue-50 px-10 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
