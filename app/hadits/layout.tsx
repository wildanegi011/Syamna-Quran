import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hadits - Syamna Quran",
  description: "Kumpulan hadits shahih dari berbagai perawi untuk bimbingan hidup Anda.",
};

export default function HaditsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
