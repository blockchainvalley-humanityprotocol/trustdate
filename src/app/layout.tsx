import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Beats - Verified Credential Based Dating',
  description: 'Find genuine connections with verified credentials',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="beats">
      <body>
        <Navigation />
        <div className="pt-24 md:pt-28 pb-16 md:pb-6 min-h-screen bg-gradient-to-b from-white to-love-light/5">
          {children}
        </div>
      </body>
    </html>
  );
} 