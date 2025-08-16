"use client";

import Link from "next/link";
import { Lightbulb, LogOut, User, Menu, X, MapPin, Vote, Settings, CreditCard, Shield, Calendar, Bus, Clock, Building, MapPinIcon, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function MenuBar() {
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const isActivePath = (path: string) => pathname === path;

  const navigationItems = [
    { href: "/", label: "Dashboard", icon: <Lightbulb className="w-4 h-4" /> },
    { href: "/report-issue", label: "Report Issue", icon: <FileText className="w-4 h-4" /> },
    { href: "/transportation", label: "Transportation", icon: <Bus className="w-4 h-4" /> },
    { href: "/events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
    { href: "/meetings", label: "Meeting Requests", icon: <Clock className="w-4 h-4" /> },
    { href: "/directory", label: "Business Directory", icon: <Building className="w-4 h-4" /> },
    { href: "/zoning", label: "Zoning", icon: <MapPinIcon className="w-4 h-4" /> },
    { href: "/voting", label: "Voting", icon: <Vote className="w-4 h-4" /> },
    { href: "/payments", label: "Bill Payments", icon: <CreditCard className="w-4 h-4" /> },
    { href: "/budget", label: "Budget Transparency", icon: <Settings className="w-4 h-4" /> },
  ];

  const techItems = [
    { href: "/tech", label: "Tech Dashboard", icon: <Settings className="w-4 h-4" /> },
  ];

  const adminItems = user?.role === 'admin' 
    ? [{ href: "/admin/dashboard", label: "Admin Dashboard", icon: <Shield className="w-4 h-4" /> }]
    : [{ href: "/admin/signup", label: "Admin", icon: <Shield className="w-4 h-4" /> }];

  return (
    <>
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg border-b border-blue-700 relative z-50">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-4">
            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSideMenu}
              className="text-white hover:bg-white/10 p-2 mr-3"
            >
              <Menu className="w-6 h-6" />
            </Button>

            {/* Logo Section */}
            <div className="flex items-center flex-1">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Lightbulb className="w-6 h-6 text-blue-900" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    CivicConnect
                  </span>
                  <span className="text-xs text-blue-200 font-medium">
                    Smart City Platform
                  </span>
                </div>
              </Link>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/profile" className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-full">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        {user.displayName || user.name || user.email?.split('@')[0]}
                      </span>
                      <span className="text-xs text-blue-200 capitalize">
                        {user.role}
                      </span>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    {loading ? 'Logging out...' : 'Logout'}
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-100 hover:text-white hover:bg-white/10"
                    >
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Background Blur Overlay */}
      {isSideMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={toggleSideMenu}
        />
      )}

      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${
        isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto overflow-x-hidden" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #1F2937'
        }}>
          <div className="p-6 pb-8">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-900" />
              </div>
              <span className="font-bold text-lg">CivicConnect</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSideMenu}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-2">
            {/* User Navigation - Only show for regular users */}
            {(!user || user.role === 'user') && navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleSideMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 ${
                  isActivePath(item.href)
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            
            {/* Tech Navigation - Only show for tech users */}
            {user?.role === 'tech' && techItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleSideMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-green-500/20 ${
                  isActivePath(item.href)
                    ? 'bg-green-600 text-white font-semibold'
                    : 'text-green-200 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            
            {/* Admin Navigation - Show for non-logged in users and admin users */}
            {(!user || user.role === 'admin') && adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleSideMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-purple-500/20 ${
                  isActivePath(item.href) || pathname?.startsWith('/admin')
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <Link href="/profile" onClick={toggleSideMenu} className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-full">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    {user.displayName || user.name || user.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">
                    {user.role}
                  </span>
                </div>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleLogout();
                  toggleSideMenu();
                }}
                disabled={loading}
                className="w-full mt-3 flex items-center gap-2 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                {loading ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          )}

          {!user && (
            <div className="mt-8 pt-6 border-t border-gray-700 space-y-3">
              <Link href="/login" onClick={toggleSideMenu}>
                <Button variant="outline" size="sm" className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={toggleSideMenu}>
                <Button 
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
}
