import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Al-Quran - Syamna Quran",
  description: "Baca dan dengarkan Al-Quran dengan pengalaman premium, transliterasi, dan audio murattal.",
};

export default function QuranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
