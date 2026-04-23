import React from 'react';

interface FooterProps {
  copyright?: string;
}

const Footer: React.FC<FooterProps> = ({ copyright = "© 2026 Eurovanta Talent. All rights reserved." }) => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500 font-medium">
          {copyright}
        </p>
        <nav className="flex gap-6 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
