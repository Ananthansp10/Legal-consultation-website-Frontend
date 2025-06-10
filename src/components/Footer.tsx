import React from 'react';
import { Scale, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Scale className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold">LegalConnect</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Connecting you with expert legal professionals for all your legal needs. Professional, reliable, and secure.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-slate-400 hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="#about" className="text-slate-400 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#services" className="text-slate-400 hover:text-white transition-colors duration-200">Services</a></li>
              <li><a href="#lawyers" className="text-slate-400 hover:text-white transition-colors duration-200">Our Lawyers</a></li>
              <li><a href="#contact" className="text-slate-400 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          {/* Legal Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Civil Law</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Criminal Law</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Family Law</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Corporate Law</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Immigration Law</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#faq" className="text-slate-400 hover:text-white transition-colors duration-200">FAQ</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#contact" className="text-slate-400 hover:text-white transition-colors duration-200">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 LegalConnect. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;