import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asmaul Husna - Syamna Quran",
  description: "Pelajari dan hayati 99 Nama Allah yang Indah.",
};

export default function AsmaulHusnaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
