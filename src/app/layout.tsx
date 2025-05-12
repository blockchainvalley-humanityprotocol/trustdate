import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrustDate - Verified Credential Based Dating',
  description: 'Dating application based on verified credentials using Humanity Protocol',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="trustdate">
      <body className={poppins.className}>
        <Navigation />
        <div className="pt-16 md:pt-20 pb-16 md:pb-6 min-h-screen bg-gradient-to-b from-white to-love-light/5">
          {children}
        </div>
      </body>
    </html>
  );
} 