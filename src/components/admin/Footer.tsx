import React from "react";
import { Scale } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/70 backdrop-blur-md border-t border-slate-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">
                <span className="text-slate-700">Legal</span>
                <span className="text-blue-500">Connect</span>
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md">
              Empowering legal professionals through seamless administration and
              connecting clients with trusted lawyers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Lawyer Verification
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-blue-500 transition-colors duration-200"
                >
                  User Management
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Reports
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © 2025 LegalConnect. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-slate-500 text-sm">Admin Panel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
