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
          <h3 className="text-3xl font-bold text-gray-900 mb-12">Platform Features</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🏛️</div>
              <h4 className="font-semibold text-gray-900 mb-2">Civic Issue Reporting</h4>
              <p className="text-gray-600 text-sm">Report and track civic issues with photo evidence and GPS location</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">�</div>
              <h4 className="font-semibold text-gray-900 mb-2">Government Programs</h4>
              <p className="text-gray-600 text-sm">Apply for government schemes and track application status</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">💳</div>
              <h4 className="font-semibold text-gray-900 mb-2">Digital Payments</h4>
              <p className="text-gray-600 text-sm">Secure online payments for government services and fees</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold text-gray-900 mb-2">WhatsApp Notifications</h4>
              <p className="text-gray-600 text-sm">Real-time updates via WhatsApp for all your applications</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">�️</div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Route Planner</h4>
              <p className="text-gray-600 text-sm">Smart route planning for Hyderabad with metro and bus info</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold text-gray-900 mb-2">Admin Dashboard</h4>
              <p className="text-gray-600 text-sm">Comprehensive analytics and issue management system</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🔧</div>
              <h4 className="font-semibold text-gray-900 mb-2">Tech Services</h4>
              <p className="text-gray-600 text-sm">Professional technician portal for issue resolution</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Chatbot Support</h4>
              <p className="text-gray-600 text-sm">24/7 intelligent assistance for all your queries</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20 text-center bg-white rounded-xl shadow-lg p-12 max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">What Our Users Say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👩‍💼</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Priya Sharma</h5>
                  <p className="text-gray-600 text-sm">Gachibowli Resident</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"The civic reporting feature helped fix the broken streetlight in our area within just 3 days. The WhatsApp updates kept me informed throughout the process!"</p>
              <div className="flex text-yellow-400 mt-3">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👨‍🔧</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Rajesh Kumar</h5>
                  <p className="text-gray-600 text-sm">Government Technician</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"The tech dashboard makes issue management so efficient. I can track all my assigned tasks and update status in real-time. Great system!"</p>
              <div className="flex text-yellow-400 mt-3">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👨‍💻</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Amit Patel</h5>
                  <p className="text-gray-600 text-sm">HITEC City Employee</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"The AI route planner is incredible! It helped me find the fastest metro route from Kondapur to my office. WhatsApp notifications keep me updated on any delays too."</p>
              <div className="flex text-yellow-400 mt-3">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">1000+</div>
                <p className="text-gray-600 text-sm">Issues Resolved</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">5000+</div>
                <p className="text-gray-600 text-sm">Active Users</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <p className="text-gray-600 text-sm">Satisfaction Rate</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <p className="text-gray-600 text-sm">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
