import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Menu, X, User, LogIn } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Scale className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-xl font-bold text-slate-700">LegalConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-slate-600 hover:text-blue-500 transition-colors duration-200">Home</a>
            <a href="#about" className="text-slate-600 hover:text-blue-500 transition-colors duration-200">About Us</a>
            <a href="#services" className="text-slate-600 hover:text-blue-500 transition-colors duration-200">Services</a>
            <a href="#lawyers" className="text-slate-600 hover:text-blue-500 transition-colors duration-200">Top Lawyers</a>
            <a href="#faq" className="text-slate-600 hover:text-blue-500 transition-colors duration-200">FAQ</a>
            <a href="#contact" className="text-slate-600 hover:text-blue-500 transition-colors duration-200">Contact</a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/auth/signin"
              className="flex items-center space-x-1 px-4 py-2 text-slate-600 hover:text-blue-500 transition-colors duration-200"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
            <Link 
              to="/auth/signup"
              className="flex items-center space-x-1 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <User className="h-4 w-4" />
              <span>Sign Up</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 p-4 border border-white/20">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-slate-600 hover:text-blue-500">Home</a>
              <a href="#about" className="text-slate-600 hover:text-blue-500">About Us</a>
              <a href="#services" className="text-slate-600 hover:text-blue-500">Services</a>
              <a href="#lawyers" className="text-slate-600 hover:text-blue-500">Top Lawyers</a>
              <a href="#faq" className="text-slate-600 hover:text-blue-500">FAQ</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-500">Contact</a>
              <hr className="border-slate-200" />
              <Link 
                to="/auth/signin"
                className="flex items-center justify-center space-x-1 py-2 text-slate-600"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link 
                to="/auth/signup"
                className="flex items-center justify-center space-x-1 py-2 bg-blue-500 text-white rounded-lg"
              >
                <User className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;