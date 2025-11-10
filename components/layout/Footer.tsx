import React from 'react';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-background/80 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
                <defs>
                  <linearGradient id="logo-gradient-ai-footer" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8E2DE2" />
                    <stop offset="1" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
                <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z" stroke="url(#logo-gradient-ai-footer)" strokeWidth="1.5" />
                <path d="M16 11.5C18.4853 11.5 20.5 13.5147 20.5 16C20.5 18.4853 18.4853 20.5 16 20.5C13.5147 20.5 11.5 18.4853 11.5 16C11.5 13.5147 13.5147 11.5 16 11.5Z" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
              </svg>
              <h1 className="text-2xl font-bold font-grotesk tracking-tighter text-white">AI Nexus</h1>
            </div>
            <p className="mt-4 text-gray-400 text-sm">Your personal suite of 20+ AI tools for text, voice, and visuals.</p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-poppins font-semibold text-brand-secondary">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#/" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#/" className="text-gray-400 hover:text-white transition-colors">All Tools</a></li>
              <li><a href="#/" className="text-gray-400 hover:text-white transition-colors">Profile</a></li>
              <li><a href="#/" className="text-gray-400 hover:text-white transition-colors">Help</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-poppins font-semibold text-brand-secondary">Contact Us</h3>
            <address className="mt-4 space-y-2 text-sm text-gray-400 not-italic">
              <p>123 AI Street, Tech City, TC 12345</p>
              <p><a href="mailto:contact@ainexus.com" className="hover:text-white transition-colors">contact@ainexus.com</a></p>
              <p><a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a></p>
            </address>
          </div>
          
          {/* Social Media */}
          <div className="col-span-1">
             <h3 className="text-lg font-poppins font-semibold text-brand-secondary">Follow Us</h3>
             <div className="flex mt-4 space-x-4">
                <a href="#" className="text-gray-400 hover:text-brand-secondary transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-brand-secondary transition-colors"><Github size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-brand-secondary transition-colors"><Linkedin size={20} /></a>
             </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} AI Nexus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;