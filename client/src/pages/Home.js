import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Award, 
  Heart, 
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Alumni Directory',
      description: 'Connect with fellow graduates and build your professional network.',
      link: '/alumni'
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary-600" />,
      title: 'Events & Reunions',
      description: 'Stay updated with upcoming events and alumni gatherings.',
      link: '/events'
    },
    {
      icon: <Briefcase className="w-8 h-8 text-primary-600" />,
      title: 'Job Board',
      description: 'Find career opportunities shared by our alumni community.',
      link: '/jobs'
    },
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: 'Success Stories',
      description: 'Celebrate the achievements of our distinguished alumni.',
      link: '/alumni'
    }
  ];

  const stats = [
    { number: '500+', label: 'Alumni Members' },
    { number: '50+', label: 'Events Yearly' },
    { number: '100+', label: 'Job Postings' },
    { number: '25+', label: 'Years of Legacy' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Bilbilash
              <span className="block text-primary-200">Alumni Association</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Reconnect with classmates, build professional networks, and celebrate the legacy of Bilbilash Secondary School.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === 'admin' || user?.role === 'authority' ? `/${user.role}` : '/dashboard'}
                    className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/alumni"
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-medium"
                  >
                    Explore Alumni
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
                  >
                    Join Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-medium"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24 text-gray-50" viewBox="0 0 1440 120" fill="currentColor">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What We Offer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the benefits of joining our vibrant alumni community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
              <div className="card-header">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="card-title">{feature.title}</h3>
              </div>
              <div className="card-content">
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                >
                  Learn More
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Reconnect?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of Bilbilash alumni who are already making a difference in our community.
            </p>
            
            {!isAuthenticated && (
              <Link
                to="/register"
                className="btn btn-primary px-8 py-3 text-lg font-medium"
              >
                Become a Member Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Recent Activity Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <p className="text-xl text-gray-600">
            Stay updated with the latest from our alumni community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-500">Upcoming Event</span>
              </div>
              <h3 className="card-title">Annual Alumni Reunion</h3>
            </div>
            <div className="card-content">
              <p className="text-gray-600 mb-2">
                Join us for our biggest annual gathering. Network with fellow alumni and celebrate our shared heritage.
              </p>
              <p className="text-sm text-gray-500">December 15, 2024</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-500">Latest Job</span>
              </div>
              <h3 className="card-title">Senior Software Engineer</h3>
            </div>
            <div className="card-content">
              <p className="text-gray-600 mb-2">
                Exciting opportunity at a leading tech company. Perfect for experienced developers looking to make an impact.
              </p>
              <p className="text-sm text-gray-500">Posted 2 days ago</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-500">Success Story</span>
              </div>
              <h3 className="card-title">Dr. Sarah Johnson '98</h3>
            </div>
            <div className="card-content">
              <p className="text-gray-600 mb-2">
                Congratulations to Dr. Johnson on her recent appointment as Dean of Medicine at a prestigious university.
              </p>
              <p className="text-sm text-gray-500">Featured this week</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
