import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "../components/providers";

export const metadata = {
  metadataBase: new URL("https://jila-starter.vercel.app/"),
  title: "Jila x Hack4impact",
  description: "Jila x Hack4Impact Fall 2025",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
