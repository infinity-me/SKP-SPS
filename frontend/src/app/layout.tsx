import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "SKP SAINIK PUBLIC SCHOOL | Manihari, Uttar Pradesh",
  description: "Premier educational institution in Manihari, Uttar Pradesh, India. Nurturing excellence and building futures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
        <footer className="bg-primary text-white py-20 px-6 border-t border-gold-500/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-heading font-bold mb-6">SKP SAINIK <span className="text-gold-500">PUBLIC SCHOOL</span></h2>
              <p className="text-white/60 max-w-sm mb-6">
                Manihari Village, Uttar Pradesh, India. <br />
                Dedicated to academic excellence and character building.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-gold-500 mb-4">Quick Links</h3>
              <ul className="flex flex-col gap-2 text-white/70">
                <li><a href="/about">About Us</a></li>
                <li><a href="/fees">Fees Structure</a></li>
                <li><a href="/admission">Admissions</a></li>
                <li><a href="/gallery">Gallery</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-gold-500 mb-4">Contact</h3>
              <p className="text-white/70">
                Email: info@skpschool.com <br />
                Phone: +91 000 000 0000
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/30 text-xs">
            © {new Date().getFullYear()} SKP SAINIK PUBLIC SCHOOL. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
