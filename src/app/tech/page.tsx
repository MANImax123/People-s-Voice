"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TechMain() {
  const router = useRouter();

  useEffect(() => {
    // Check if tech is already logged in
    const authData = localStorage.getItem('techAuth');
    if (authData) {
      // If logged in, redirect to dashboard
      router.push('/tech/dashboard');
    } else {
      // If not logged in, redirect to login
      router.push('/tech/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
