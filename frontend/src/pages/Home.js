import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Briefcase, Heart, Award, TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Vibrant Mixed Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mixed"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
              Join 5,000+ Alumni Worldwide
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              Welcome to <span className="text-accent-300">Bilbilash</span> Alumni
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto">
              Connect, collaborate, and celebrate with fellow graduates in a vibrant community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group btn bg-white text-slate-900 hover:bg-accent-50 px-8 py-4 text-lg font-bold shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
              >
                Join Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="btn bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg font-bold transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section - Fresh Gradient Background */}
      <section className="py-20 section-fresh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Our Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-green mb-6">
              What We Offer
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover the benefits of being part of our vibrant alumni community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 - Alumni Network */}
            <div className="card card-hover p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Alumni Network</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect with thousands of Bilbilash graduates worldwide and expand your professional network
              </p>
            </div>

            {/* Feature Card 2 - Job Opportunities */}
            <div className="card card-hover p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-500/30">
                <Briefcase className="w-10 h-10 text-slate-900" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Job Opportunities</h3>
              <p className="text-slate-600 leading-relaxed">
                Access exclusive job postings and career opportunities from fellow alumni
              </p>
            </div>

            {/* Feature Card 3 - Events */}
            <div className="card card-hover p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-secondary-500/30">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Events & Reunions</h3>
              <p className="text-slate-600 leading-relaxed">
                Stay updated on alumni events, workshops, and annual reunions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - Gradient Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-4">
              Impact
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-mixed mb-6">
              Our Growing Community
            </h2>
            <p className="text-xl text-slate-600">
              Numbers that showcase our vibrant alumni network
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="card p-8 text-center hover-lift">
              <div className="text-5xl font-bold text-gradient-green mb-3">5,000+</div>
              <p className="text-slate-600 font-medium">Active Alumni</p>
            </div>
            <div className="card p-8 text-center hover-lift">
              <div className="text-5xl font-bold bg-gradient-to-r from-accent-500 to-yellow-500 bg-clip-text text-transparent mb-3">200+</div>
              <p className="text-slate-600 font-medium">Job Postings</p>
            </div>
            <div className="card p-8 text-center hover-lift">
              <div className="text-5xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-600 bg-clip-text text-transparent mb-3">50+</div>
              <p className="text-slate-600 font-medium">Events Yearly</p>
            </div>
            <div className="card p-8 text-center hover-lift">
              <div className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-primary-600 bg-clip-text text-transparent mb-3">15+</div>
              <p className="text-slate-600 font-medium">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Vibrant Yellow/Green */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-400 via-accent-300 to-primary-400"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-slate-800/80 max-w-2xl mx-auto">
            Become part of something bigger and reconnect with your alma mater today
          </p>
          <Link
            to="/register"
            className="group btn bg-slate-900 text-white hover:bg-slate-800 px-10 py-4 text-lg font-bold shadow-2xl shadow-slate-900/30 hover:shadow-slate-900/50 transition-all duration-300"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
