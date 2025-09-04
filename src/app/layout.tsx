import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pajak Bro',
  description: 'Kalkulator Pajak Lengkap',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
