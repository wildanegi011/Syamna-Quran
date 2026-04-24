import { PrayerApiResponse, PrayerScheduleData } from "./types";
import { fetchProvinces, fetchCities, fetchPrayerSchedule } from "./api/prayer";

export async function getProvinces(): Promise<string[]> {
  const result: PrayerApiResponse<string[]> = await fetchProvinces();
  if (result.code !== 200) throw new Error(result.message);
  return result.data;
}

export async function getCities(province: string): Promise<string[]> {
  const result: PrayerApiResponse<string[]> = await fetchCities(province);
  if (result.code !== 200) throw new Error(result.message);
  return result.data;
}

export async function getPrayerSchedule(
  province: string,
  city: string,
  month?: number,
  year?: number
): Promise<PrayerScheduleData> {
  const result: PrayerApiResponse<PrayerScheduleData> = await fetchPrayerSchedule(
    province,
    city,
    month || new Date().getMonth() + 1,
    year || new Date().getFullYear()
  );
  if (result.code !== 200) throw new Error(result.message);
  return result.data;
}
