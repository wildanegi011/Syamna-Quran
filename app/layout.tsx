import { Plus_Jakarta_Sans, Amiri, Cairo, Lateef } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

const lateef = Lateef({
  variable: "--font-lateef",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: {
    default: "Syamna Quran - Rasakan Kedamaian dalam Wahyu",
    template: "%s | Syamna Quran"
  },
  description: "Aplikasi Quran premium dengan pengalaman membaca yang tenang, transliterasi, tafsir, dan audio murattal berkualitas tinggi.",
  keywords: ["Quran", "Al-Quran Online", "Hadits", "Jadwal Sholat", "Asmaul Husna", "Ibadah Digital", "Syamna Quran"],
  authors: [{ name: "Syamna" }],
  creator: "Syamna",
  publisher: "Syamna",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://syamna-quran.com", // Ganti dengan domain asli jika sudah ada
    siteName: "Syamna Quran",
    title: "Syamna Quran - Rasakan Kedamaian dalam Wahyu",
    description: "Aplikasi Quran premium dengan pengalaman membaca yang tenang, transliterasi, tafsir, dan audio murattal berkualitas tinggi.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Syamna Quran Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Syamna Quran - Rasakan Kedamaian dalam Wahyu",
    description: "Aplikasi Quran premium dengan pengalaman membaca yang tenang, transliterasi, tafsir, dan audio murattal berkualitas tinggi.",
    images: ["/og-image.png"],
    creator: "@syamnaquran",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import { SpotifyLayout } from "@/components/quran/spotify/SpotifyLayout";
import { Metadata } from "next";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          jakarta.variable,
          amiri.variable,
          lateef.variable,
          cairo.variable
        )}
      >
        <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider delayDuration={0}>
                <SpotifyLayout>
                  {children}
                </SpotifyLayout>
                {/* <Toaster dark position="top-center" richColors /> */}
              </TooltipProvider>
            </ThemeProvider>
        </Providers>
        <GoogleAnalytics />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Syamna Quran",
              "url": "https://syamna-quran.com",
              "description": "Aplikasi Quran premium dengan pengalaman membaca yang tenang, transliterasi, tafsir, dan audio murattal berkualitas tinggi.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://syamna-quran.com/quran?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
