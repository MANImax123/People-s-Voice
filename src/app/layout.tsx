import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/footer';
import LiveChatbot from '@/components/live-chatbot';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import ConditionalNavigation from '@/components/conditional-navigation';
import ConditionalMain from '@/components/conditional-main';

export const metadata: Metadata = {
  title: 'CivicConnect - Smart City Platform',
  description: 'Report civic issues, engage with your community, and make your voice heard. A comprehensive platform for citizen participation in local governance.',
  keywords: ['civic engagement', 'community issues', 'local government', 'citizen participation', 'smart city'],
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
      <body className="font-body antialiased min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
        <AuthProvider>
          <ConditionalNavigation />
          <ConditionalMain>
            {children}
          </ConditionalMain>
          <Footer />
          <LiveChatbot />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
