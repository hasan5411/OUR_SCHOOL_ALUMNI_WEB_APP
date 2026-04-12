import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-bold text-4xl">404</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center btn btn-primary px-6 py-3 text-base font-medium"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          
          <div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
        
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            If you think this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
