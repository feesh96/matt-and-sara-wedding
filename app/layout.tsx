import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/libre-franklin/400.css";
import "@fontsource/libre-franklin/500.css";
import "./theme.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mattandsara.us"),
  title: {
    default: "Sara & Matt | May 30, 2027",
    template: "%s | Sara & Matt",
  },
  description: "Save the date for Sara and Matt's wedding in Princeton, New Jersey.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#20221d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
