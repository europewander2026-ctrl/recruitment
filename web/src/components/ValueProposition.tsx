import React from 'react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ValuePropositionProps {
  features: Feature[];
}

const ValueProposition: React.FC<ValuePropositionProps> = ({ features }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-darkBlue mb-4">
            Why Choose ImmiHire?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Streamline your recruitment process with our advanced, AI-driven platform designed for modern talent acquisition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card flex flex-col items-center text-center h-full hover:shadow-card"
            >
              <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 text-2xl">
                {feature.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-darkBlue mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
