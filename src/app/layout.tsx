import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Md. Abdur Rahman | Law, Technology & Sustainability",
    template: "%s | Md. Abdur Rahman",
  },
  description:
    "Portfolio of Md. Abdur Rahman, a law graduate and junior frontend developer with EU Digital Product Passport experience across traceability, regulation, circular economy and sustainability.",
  keywords: [
    "law and technology",
    "Digital Product Passport",
    "EU compliance",
    "sustainability",
    "traceability",
    "data protection",
    "digital governance",
    "digital evidence",
    "photography",
    "videography",
    "academic portfolio",
  ],
  authors: [{ name: "Md. Abdur Rahman" }],
  creator: "Md. Abdur Rahman",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title: "Md. Abdur Rahman | Law, Technology & Sustainability",
    description:
      "Bridging law, technology and sustainability through EU Digital Product Passport experience.",
    siteName: "Md. Abdur Rahman — Academic Portfolio",
    locale: "en_GB",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Md. Abdur Rahman — Law, Technology and Responsible digital systems" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Md. Abdur Rahman | Law, Technology & Sustainability",
    description:
      "Bridging law, technology and sustainability through EU Digital Product Passport experience.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#06101d" },
  ],
};

const themeScript = `
  (() => {
    try {
      const stored = localStorage.getItem("portfolio-theme");
      const theme = stored === "light" || stored === "dark"
        ? stored
        : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {}
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>{children}</body>
    </html>
  );
}
