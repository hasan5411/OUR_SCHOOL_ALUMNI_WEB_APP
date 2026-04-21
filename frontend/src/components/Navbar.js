import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, Calendar, Bell, Briefcase, User, LogOut, Settings, Shield, Crown } from 'lucide-react';
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
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 via-green-600 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Bilbilash Alumni
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-700 hover:bg-green-100'
              }`}
            >
              <Home className="w-4 h-4 inline mr-1" />
              Home
            </Link>
            
            {isAuthenticated && (
              <Link
                to={getDashboardRoute()}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(getDashboardRoute()) 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-700 hover:bg-green-100'
                }`}
              >
                <User className="w-4 h-4 inline mr-1" />
                {isAuthority() ? 'Authority' : isAdmin() ? 'Admin' : 'Dashboard'}
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {isAuthority() && <Crown className="w-4 h-4 text-purple-600" />}
                  {isAdmin() && !isAuthority() && <Shield className="w-4 h-4 text-blue-600" />}
                  <span className="text-sm text-gray-700">
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 inline mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700"
                >
                  Login
                </Link>
                
                <Link
                  to="/register"
                  className="btn btn-success px-4 py-2 text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
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
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Home
            </Link>
            
            {isAuthenticated && (
              <Link
                to={getDashboardRoute()}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(getDashboardRoute()) 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4 inline mr-2" />
                {isAuthority() ? 'Authority' : isAdmin() ? 'Admin' : 'Dashboard'}
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    {isAuthority() && <Crown className="w-4 h-4 text-purple-600" />}
                    {isAdmin() && !isAuthority() && <Shield className="w-4 h-4 text-blue-600" />}
                    <span className="text-sm text-gray-700">
                      {user?.first_name} {user?.last_name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-700"
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
