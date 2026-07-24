import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: 'TanyaTV — Every Love Story Deserves Its Own Streaming Service',
  description: 'A personalized streaming platform built exclusively for the most beautiful girl in the world.',
  openGraph: {
    title: 'TanyaTV',
    description: 'Every Love Story Deserves Its Own Streaming Service.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#141414] text-white overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
