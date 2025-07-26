import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import MenuBar from '@/components/menu-bar';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';

export const metadata: Metadata = {
  title: 'Streetlight Sentinel',
  description: 'Report streetlight and other civic issues in your community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background">
        <AuthProvider>
          <MenuBar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
