import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tech Dashboard - People\'s Voice',
  description: 'Manage and resolve civic issues assigned to you',
};

export default function TechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
