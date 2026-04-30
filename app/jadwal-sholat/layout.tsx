import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jadwal Sholat - Syamna Quran",
  description: "Waktu sholat akurat berdasarkan lokasi Anda saat ini.",
};

export default function JadwalSholatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
