import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-secondary-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* School Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-5">
              <div className="w-12 h-12 bg-gradient-mixed rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Bilbilash Secondary School
              </span>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed max-w-md">
              Connecting alumni, fostering lifelong relationships, and building a stronger community through the Bilbilash Secondary School Alumni Association.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-primary-500 hover:text-white transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-secondary-500 hover:text-white transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-accent-500 hover:text-slate-900 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white flex items-center">
              <span className="w-1 h-5 bg-gradient-to-b from-accent-400 to-primary-500 rounded-full mr-3"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/dashboard" className="text-slate-400 hover:text-accent-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/events" className="text-slate-400 hover:text-secondary-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Events
                </a>
              </li>
              <li>
                <a href="/login" className="text-slate-400 hover:text-primary-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="text-slate-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white flex items-center">
              <span className="w-1 h-5 bg-gradient-to-b from-primary-400 to-secondary-500 rounded-full mr-3"></span>
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-accent-500/20 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-accent-400" />
                </div>
                <span className="text-slate-300">alumni@bilbilash.edu</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-slate-300">+234 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center group-hover:bg-secondary-500/20 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-secondary-400" />
                </div>
                <span className="text-slate-300">Bilbilash, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Bilbilash Secondary School Alumni Association. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-accent-400 text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-400 text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-secondary-400 text-sm transition-colors duration-300">
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
