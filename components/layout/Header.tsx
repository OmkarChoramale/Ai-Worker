import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-brand-background/60 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
            <defs>
              <linearGradient id="logo-gradient-ai" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8E2DE2" />
                <stop offset="1" stopColor="#00D4FF" />
              </linearGradient>
            </defs>
            <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z" stroke="url(#logo-gradient-ai)" strokeWidth="1.5" />
            <path d="M16 11.5C18.4853 11.5 20.5 13.5147 20.5 16C20.5 18.4853 18.4853 20.5 16 20.5C13.5147 20.5 11.5 18.4853 11.5 16C11.5 13.5147 13.5147 11.5 16 11.5Z" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
            <path d="M20.5 16H25" stroke="url(#logo-gradient-ai)" strokeWidth="2" strokeLinecap="round" />
            <path d="M23 11L20.5 13.5" stroke="url(#logo-gradient-ai)" strokeWidth="2" strokeLinecap="round" />
            <path d="M23 21L20.5 18.5" stroke="url(#logo-gradient-ai)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="25" cy="16" r="1.5" fill="url(#logo-gradient-ai)" />
          </svg>
          <h1 className="text-2xl font-bold font-grotesk tracking-tighter text-white">AI Nexus</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search tools..."
              className="w-40 md:w-64 pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-secondary text-sm text-white"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <img
            src="https://picsum.photos/seed/user/40/40"
            alt="User Avatar"
            className="h-10 w-10 rounded-full border-2 border-brand-secondary"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;