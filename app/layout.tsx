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
