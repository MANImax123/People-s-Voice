import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">CMR HACK</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your comprehensive platform for civic issue reporting and tech services
          </p>
        </div>

        {/* Civic Issue Reporting Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg p-8 text-white text-center mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🏛️</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Civic Issue Reporting</h2>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Report civic issues in your community with photo evidence and location details. 
              Help improve your city by reporting problems like broken streetlights, potholes, garbage collection issues, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/report-issue"
                className="bg-white text-orange-600 py-3 px-8 rounded-lg font-semibold hover:bg-orange-50 transition-colors inline-flex items-center justify-center"
              >
                <span className="mr-2">📝</span>
                Report New Issue
              </Link>
              <Link
                href="/issues"
                className="bg-white/20 text-white py-3 px-8 rounded-lg font-semibold hover:bg-white/30 transition-colors inline-flex items-center justify-center border border-white/30"
              >
                <span className="mr-2">📊</span>
                View All Issues
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* User Login Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">User Portal</h2>
              <p className="text-gray-600">Access your account and services</p>
            </div>
            <div className="space-y-4">
              <Link
                href="/login"
                className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
              >
                User Login
              </Link>
              <Link
                href="/signup"
                className="block w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Tech Login Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tech Portal</h2>
              <p className="text-gray-600">Manage services and technical operations</p>
            </div>
            <div className="space-y-4">
              <Link
                href="/tech/login"
                className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors"
              >
                Tech Login
              </Link>
              <Link
                href="/tech/signup"
                className="block w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
              >
                Join as Tech
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Platform Features</h3>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">🏛️</div>
              <h4 className="font-semibold text-gray-900 mb-2">Civic Reporting</h4>
              <p className="text-gray-600 text-sm">Report and track civic issues in your community</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">🔧</div>
              <h4 className="font-semibold text-gray-900 mb-2">Technical Services</h4>
              <p className="text-gray-600 text-sm">Professional tech services and support</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold text-gray-900 mb-2">User Management</h4>
              <p className="text-gray-600 text-sm">Comprehensive user account management</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold text-gray-900 mb-2">Modern Platform</h4>
              <p className="text-gray-600 text-sm">Built with latest technologies and best practices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
