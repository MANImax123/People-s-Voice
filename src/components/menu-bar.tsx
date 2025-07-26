"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lightbulb, ShieldCheck, LayoutDashboard, User, LogOut, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function MenuBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
      });
    }
  };

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
            <Lightbulb className="w-8 h-8" />
            <span className="text-xl font-headline font-bold">Streetlight Sentinel</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
                <Link href="/">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/report">Report an Issue</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="/technician/login">Technician Panel</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="/admin/login">Admin</Link>
            </Button>

            <div className="flex items-center gap-2 ml-4">
              {user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                     <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
