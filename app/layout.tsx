import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Puff Design AI — AI UI Builder",
  description: "Generate and edit UI layouts with AI. Type a prompt, get a design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-surface-900 text-slate-200">
        {children}
      </body>
    </html>
  );
}
