import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  Bell, 
  Briefcase, 
  User, 
  LogOut, 
  Settings,
  Shield,
  Crown
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'authority':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'authority':
        return '/authority';
      case 'admin':
        return '/admin';
      case 'member':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
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
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4 inline mr-1" />
              Home
            </Link>
            
            <Link
              to="/alumni"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/alumni') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4 inline mr-1" />
              Alumni
            </Link>
            
            <Link
              to="/events"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/events') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Events
            </Link>
            
            <Link
              to="/announcements"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/announcements') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bell className="w-4 h-4 inline mr-1" />
              News
            </Link>
            
            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/jobs') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-1" />
              Jobs
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {getRoleIcon(user?.role)}
                  <span className="capitalize">{user?.role}</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </span>
                    </div>
                    <span>{user?.first_name} {user?.last_name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Profile
                    </Link>
                    <Link
                      to={getDashboardPath()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 inline mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary px-4 py-2 text-sm"
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
            
            <Link
              to="/alumni"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/alumni') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Alumni
            </Link>
            
            <Link
              to="/events"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/events') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Events
            </Link>
            
            <Link
              to="/announcements"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/announcements') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Bell className="w-4 h-4 inline mr-2" />
              News
            </Link>
            
            <Link
              to="/jobs"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/jobs') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Jobs
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to={getDashboardPath()}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Dashboard
                </Link>
                
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </>
            )}
            
            {!isAuthenticated && (
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
