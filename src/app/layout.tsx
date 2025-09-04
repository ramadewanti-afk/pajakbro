import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pajak Bro',
  description: 'Kalkulator Pajak Lengkap',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#14b8a6" />
      </head>
      <body>{children}</body>
    </html>
  );
}
