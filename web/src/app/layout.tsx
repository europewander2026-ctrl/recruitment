import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Montserrat, Space_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta' 
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat' 
});

const spaceMono = Space_Mono({ 
  subsets: ["latin"], 
  weight: ['400', '700'],
  variable: '--font-mono' 
});

export const metadata: Metadata = {
  title: 'Eurovanta Talent | Global Recruitment & Verification',
  description: 'Seamless Global Recruitment and Secure Document Verification.',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${montserrat.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
