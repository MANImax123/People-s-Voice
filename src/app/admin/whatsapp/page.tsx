'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WhatsAppNotificationPanel from '@/components/whatsapp-notification-panel';

export default function AdminWhatsAppPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check admin authentication
    const authData = localStorage.getItem('auth-user');
    const adminData = localStorage.getItem('admin-user');
    
    let adminUser = null;
    if (authData) {
      const userData = JSON.parse(authData);
      if (userData.role === 'admin') {
        adminUser = userData;
      }
    }
    
    if (!adminUser && adminData) {
      adminUser = JSON.parse(adminData);
    }
    
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }

    setUser(adminUser);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WhatsAppNotificationPanel />
    </div>
  );
}
