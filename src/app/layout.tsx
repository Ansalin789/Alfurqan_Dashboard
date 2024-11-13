import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "/public/assets/css/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";  // Import GoogleOAuthProvider

const inter = Inter({ subsets: ['latin'] });

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
        {/* Wrap children with GoogleOAuthProvider */}
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
