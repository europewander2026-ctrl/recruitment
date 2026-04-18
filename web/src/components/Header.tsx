import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Recruitment Ops" }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 z-10 sticky top-0">
      <h2 className="font-heading font-bold text-2xl text-darkBlue tracking-tight">
        {title}
      </h2>
      <div className="flex items-center gap-4">
        <button
          className="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <span>+</span> Add New Position
        </button>
      </div>
    </header>
  );
};

export default Header;
