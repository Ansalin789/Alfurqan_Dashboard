import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from '@/context/ThemeContext';




const inter = Inter({ subsets: ['latin'],  display: 'swap', });

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
      <body className={inter.className}>
        <ThemeProvider>
          <GoogleOAuthProvider clientId="1095351282036-anf4nldkvcn2q9a9osrhuj6oqb11to05.apps.googleusercontent.com">
            {children}
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
