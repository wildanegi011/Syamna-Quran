import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kumpulan Doa - Syamna Quran",
  description: "Daftar doa harian untuk berbagai situasi dan kebutuhan.",
};

export default function DoaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
