import React from 'react';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface ProcessProps {
  steps: Step[];
}

const Process: React.FC<ProcessProps> = ({ steps }) => {
  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-darkBlue mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our streamlined process ensures you find the perfect talent in record time.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Step Number Circle */}
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-heading font-bold text-xl shadow-lg shadow-blue-500/30 mb-6 relative z-10">
                  {step.number}
                </div>
                
                <div className="glass-card w-full py-8">
                  <h3 className="font-heading text-xl font-bold text-darkBlue mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
