"use client";

import Link from "next/link";
import { Lightbulb, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";

export default function MenuBar() {
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();

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

  return (
    <nav className="bg-zinc-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Lightbulb className="w-6 h-6" /> Urban Voice
        </Link>
        {user?.role === 'tech' && (
          <Link href="/tech" className="ml-4">Tech</Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          // User is logged in
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">
                {user.displayName || user.email}
              </span>
              <span className="text-xs bg-zinc-700 px-2 py-1 rounded">
                {user.role}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {loading ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        ) : (
          // User is not logged in
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
