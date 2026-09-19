import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Concierge",
  description:
    "The insider move for adult children caring for aging parents. Not a directory—the actual move.",
  icons: {
    icon: "/brand/concierge-mark.png",
    apple: "/brand/concierge-mark.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
