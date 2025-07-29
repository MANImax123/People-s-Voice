'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Apply different styling for tech routes
  const isTechRoute = pathname?.startsWith('/tech');
  
  if (isTechRoute) {
    // Tech pages handle their own layout
    return <>{children}</>;
  }
  
  // Regular pages get container styling
  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      {children}
    </main>
  );
}
