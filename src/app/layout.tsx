import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const monumentWide = localFont({
  src: [
    {
      path: "../../public/fonts/otf/PPMonumentWide-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/otf/PPMonumentWide-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-monument-wide",
});

export const metadata: Metadata = {
  title: "Jaedon Taylor",
  description: "Jaedon Taylor's Portfolio Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${monumentWide.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
