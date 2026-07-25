import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: 'TanyaTV — Our Love Story Deserves Its Own Streaming Service',
  description: 'A personalized streaming platform built exclusively for the most beautiful girl in the world.',
  openGraph: {
    title: 'TanyaTV',
    description: 'Our Love Story Deserves Its Own Streaming Service.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#141414',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark bg-[#141414]">
      <body className={`${inter.className} bg-[#141414] text-white overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
