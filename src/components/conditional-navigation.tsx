'use client';

import { usePathname } from 'next/navigation';
import MenuBar from '@/components/menu-bar';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Hide main navigation for tech routes and admin dashboard
  const isTechRoute = pathname?.startsWith('/tech');
  const isAdminDashboard = pathname === '/admin/dashboard';
  
  if (isTechRoute || isAdminDashboard) {
    return null; // Tech pages and admin dashboard have their own navigation
  }
  
  return <MenuBar />;
}
