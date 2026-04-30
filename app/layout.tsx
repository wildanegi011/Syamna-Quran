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
  title: "Syamna Quran - Rasakan Kedamaian dalam Wahyu",
  description: "Aplikasi Quran dengan pengalaman premium, transliterasi, dan audio murattal.",
};

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import { SpotifyLayout } from "@/components/quran/spotify/SpotifyLayout";
import { Metadata } from "next";
import Script from "next/script";


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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
