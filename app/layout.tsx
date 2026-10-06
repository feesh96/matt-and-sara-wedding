import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "./theme.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mattandsara.us"),
  title: {
    default: "Sara & Matt | May 30, 2027",
    template: "%s | Sara & Matt",
  },
  description: "Sara and Matt's wedding celebration in Princeton, New Jersey.",
  icons: {
    icon: [
      { url: "/ring-icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "Sara & Matt",
    title: "Sara & Matt | May 30, 2027",
    description: "Celebrate with us in Princeton, New Jersey on May 30, 2027.",
    images: [
      {
        url: "/social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Sara and Matt together in Japan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sara & Matt | May 30, 2027",
    description: "Celebrate with us in Princeton, New Jersey on May 30, 2027.",
    images: ["/social-preview.jpg"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
