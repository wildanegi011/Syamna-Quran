import { PrayerApiResponse, PrayerScheduleData } from "./types";
import { CONFIG } from "./api-config";

const BASE_URL = `${CONFIG.EQURAN_API}/v2/shalat`;


export async function getProvinces(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/provinsi`);
  const result: PrayerApiResponse<string[]> = await response.json();
  if (result.code !== 200) throw new Error(result.message);
  return result.data;
}

export async function getCities(province: string): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/kabkota`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provinsi: province }),
  });
  const result: PrayerApiResponse<string[]> = await response.json();
  if (result.code !== 200) throw new Error(result.message);
  return result.data;
}

export async function getPrayerSchedule(
  province: string,
  city: string,
  month?: number,
  year?: number
): Promise<PrayerScheduleData> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provinsi: province,
      kabkota: city,
      bulan: month || new Date().getMonth() + 1,
      tahun: year || new Date().getFullYear(),
    }),
  });
  const result: PrayerApiResponse<PrayerScheduleData> = await response.json();
  if (result.code !== 200) throw new Error(result.message);
  return result.data;
}
