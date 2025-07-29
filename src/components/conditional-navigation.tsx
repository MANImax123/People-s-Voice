'use client';

import { usePathname } from 'next/navigation';
import MenuBar from '@/components/menu-bar';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Hide main navigation for tech routes
  const isTechRoute = pathname?.startsWith('/tech');
  
  if (isTechRoute) {
    return null; // Tech pages have their own navigation
  }
  
  return <MenuBar />;
}
