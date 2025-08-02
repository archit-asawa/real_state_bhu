import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Components
import SearchPage from './pages/SearchPage.tsx';
import PropertyDetailPage from './pages/PropertyDetailPage.tsx';
import AboutPage from './pages/AboutPage.tsx';

// Icons
import { Home, Search, Info, MapPin } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">BhuExpert</h1>
                    <p className="text-xs text-gray-500">Real Estate Platform</p>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Properties</span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </Link>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Mumbai, Maharashtra</span>
                  </div>
                </nav>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-700 hover:text-blue-600 p-2"
                    aria-label="Toggle menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {isMenuOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile Navigation - Only show on mobile and when menu is open */}
              {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 py-4 bg-white">
                  <div className="flex flex-col space-y-4">
                    <Link
                      to="/"
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Search className="w-4 h-4" />
                      <span>Search Properties</span>
                    </Link>
                    <Link
                      to="/about"
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Info className="w-4 h-4" />
                      <span>About</span>
                    </Link>
                    <div className="flex items-center space-x-2 text-gray-500 px-4 py-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Mumbai, Maharashtra</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/property/:id" element={<PropertyDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Info */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">BhuExpert</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Your trusted partner in finding the perfect property. 
                    Search, discover, and connect with your dream home.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
                  <div className="space-y-2">
                    <Link to="/" className="block text-sm text-gray-600 hover:text-blue-600">
                      Search Properties
                    </Link>
                    <Link to="/about" className="block text-sm text-gray-600 hover:text-blue-600">
                      About Us
                    </Link>
                    <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">
                      Contact
                    </a>
                    <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">
                      Privacy Policy
                    </a>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact Info</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Email: info@bhuexpert.com</p>
                    <p>Phone: +91 9876543210</p>
                    <p>Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                <p className="text-sm text-gray-600">
                  © 2025 BhuExpert. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
