import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Belajar Iqro - Syamna Quran",
  description: "Metode belajar membaca Al-Quran dengan mudah dan menyenangkan.",
};

export default function IqroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
