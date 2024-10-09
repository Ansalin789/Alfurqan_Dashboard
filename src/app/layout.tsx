import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "/public/assets/css/globals.css";

const inter = Inter({subsets: ['latin']});

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Alfurqan Academy",
  description: "From Learn Quran Alfurqan Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        {children}
      </body>
    </html>
  );
}


// className={`${geistSans.variable} ${geistMono.variable} antialiased`}