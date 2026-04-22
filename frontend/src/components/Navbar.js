import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, Calendar, Bell, Briefcase, User, LogOut, Settings, Shield, Crown, Calendar as EventIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin, isAuthority } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return window.location.pathname === path;
  };

  const getDashboardRoute = () => {
    if (isAuthority()) return '/authority';
    if (isAdmin()) return '/admin';
    return '/dashboard';
  };

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 bg-gradient-mixed rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-xl group-hover:shadow-primary-500/30 transition-all duration-300">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gradient-mixed">
                Bilbilash Alumni
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-primary-500 to-emerald-500 text-white shadow-md shadow-primary-500/20'
                  : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/events"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive('/events')
                      ? 'bg-gradient-to-r from-secondary-400 to-secondary-500 text-white shadow-md shadow-secondary-500/20'
                      : 'text-slate-600 hover:bg-secondary-50 hover:text-secondary-700'
                  }`}
                >
                  <EventIcon className="w-4 h-4 inline mr-2" />
                  Events
                </Link>
                <Link
                  to={getDashboardRoute()}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(getDashboardRoute())
                      ? 'bg-gradient-to-r from-primary-500 to-emerald-500 text-white shadow-md shadow-primary-500/20'
                      : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  {isAuthority() ? 'Authority' : isAdmin() ? 'Admin' : 'Dashboard'}
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full">
                  {isAuthority() && <Crown className="w-4 h-4 text-accent-500" />}
                  {isAdmin() && !isAuthority() && <Shield className="w-4 h-4 text-primary-500" />}
                  <span className="text-sm font-medium text-slate-700">
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-accent px-5 py-2 text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-primary-600 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-primary-500 to-emerald-500 text-white'
                  : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-5 h-5 inline mr-3" />
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/events"
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive('/events')
                      ? 'bg-gradient-to-r from-secondary-400 to-secondary-500 text-white'
                      : 'text-slate-600 hover:bg-secondary-50 hover:text-secondary-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <EventIcon className="w-5 h-5 inline mr-3" />
                  Events
                </Link>
                <Link
                  to={getDashboardRoute()}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive(getDashboardRoute())
                      ? 'bg-gradient-to-r from-primary-500 to-emerald-500 text-white'
                      : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 inline mr-3" />
                  {isAuthority() ? 'Authority' : isAdmin() ? 'Admin' : 'Dashboard'}
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 border-t border-slate-100">
                  <div className="flex items-center space-x-2 mb-3 bg-slate-50 p-3 rounded-xl">
                    {isAuthority() && <Crown className="w-5 h-5 text-accent-500" />}
                    {isAdmin() && !isAuthority() && <Shield className="w-5 h-5 text-primary-500" />}
                    <span className="text-sm font-medium text-slate-700">
                      {user?.first_name} {user?.last_name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5 inline mr-3" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="block px-4 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-accent-400 to-yellow-500 text-slate-900 shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
