import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/context/ThemeContext";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"], // Specify the weights you need
});

export const metadata: Metadata = {
  title: "Blackstone Academy",
  description: "From the heart of the community, Blackstone Academy is a beacon of knowledge and growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeProvider>
          <GoogleOAuthProvider clientId="672400357916-n7nem2lvccl389dtpg50guj2i6gdsl8t.apps.googleusercontent.com">
            {children}
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
