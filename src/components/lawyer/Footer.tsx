import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/70 backdrop-blur-md border-t border-gray-200 shadow-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">
              About LegalConnect
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Connecting clients with experienced legal professionals for
              quality consultations and expert advice. Our platform makes legal
              services accessible, transparent, and efficient.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Quick Links</h3>
            <div className="space-y-2">
              {[
                "Home",
                "Appointments",
                "Reviews",
                "Contact",
                "Privacy Policy",
                "Terms of Service",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-slate-600 hover:text-blue-600 text-sm transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="text-sm font-medium text-slate-800">
                    support@legalconnect.com
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="text-sm font-medium text-slate-800">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Office</p>
                  <p className="text-sm font-medium text-slate-800">
                    123 Legal Street, Suite 100
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-600">
              © 2025 LegalConnect. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
