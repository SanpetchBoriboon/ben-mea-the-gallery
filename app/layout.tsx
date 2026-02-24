import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import './globals.css';

const kanit = Kanit({
  variable: '--font-kanit',
  subsets: ['latin', 'thai'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Ben Mae The Wedding Gallery',
  description: 'Image for wedding',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${kanit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
