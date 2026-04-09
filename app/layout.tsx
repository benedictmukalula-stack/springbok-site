import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Camp Global",
  description: "Premium corporate training and capability development.",
};

function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Knowledge Camp Global
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/programmes" className="hover:opacity-70">
            Programmes
          </Link>
          <Link href="/register" className="hover:opacity-70">
            Registration
          </Link>
          <Link href="/checkout" className="hover:opacity-70">
            Cart / Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-600">
        <p className="font-medium text-gray-900">Knowledge Camp Global</p>
        <p className="mt-2">
          Premium corporate training, leadership development, and capability building.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
