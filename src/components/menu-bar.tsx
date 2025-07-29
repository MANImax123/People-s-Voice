"use client";

import Link from "next/link";
import { Lightbulb, LogOut, User, Menu, X, MapPin, Vote, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function MenuBar() {
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const isActivePath = (path: string) => pathname === path;

  const navigationItems = [
    { href: "/", label: "Dashboard", icon: <Lightbulb className="w-4 h-4" /> },
    { href: "/directory", label: "Directory", icon: <MapPin className="w-4 h-4" /> },
    { href: "/voting", label: "Voting", icon: <Vote className="w-4 h-4" /> },
  ];

  const techItems = [
    { href: "/tech", label: "Tech", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg border-b border-blue-700">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Lightbulb className="w-6 h-6 text-blue-900" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  People's Voice
                </span>
                <span className="text-xs text-blue-200 font-medium">
                  Civic Engagement Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/10 ${
                  isActivePath(item.href)
                    ? 'bg-white/20 text-white font-semibold shadow-inner'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            
            {/* Tech Navigation */}
            {user?.role === 'tech' && techItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-green-500/20 ${
                  isActivePath(item.href)
                    ? 'bg-green-500/30 text-white font-semibold'
                    : 'text-green-200 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
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
                </div>
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
                <Link href="/signup">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-700 py-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActivePath(item.href)
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {user?.role === 'tech' && techItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-200 hover:bg-green-500/20 hover:text-white transition-all duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile User Section */}
              <div className="border-t border-blue-700 pt-4 mt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg">
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
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      disabled={loading}
                      className="w-full flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <LogOut className="w-4 h-4" />
                      {loading ? 'Logging out...' : 'Logout'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full text-blue-100 hover:text-white hover:bg-white/10">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white hover:from-blue-600 hover:to-indigo-700"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
