/**
 * Fetches the list of provinces for prayer schedules from internal API.
 */
export async function fetchProvinces() {
  const response = await fetch('/api/prayer/provinsi');
  if (!response.ok) throw new Error("Failed to fetch provinces");
  return await response.json();
}

/**
 * Fetches the list of cities for a specific province from internal API.
 */
export async function fetchCities(province: string) {
  const response = await fetch('/api/prayer/kabkota', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provinsi: province }),
  });
  if (!response.ok) throw new Error("Failed to fetch cities");
  return await response.json();
}

/**
 * Fetches the prayer schedule for a specific city and province from internal API.
 */
export async function fetchPrayerSchedule(
  province: string,
  city: string,
  month: number,
  year: number
) {
  const response = await fetch('/api/prayer', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provinsi: province,
      kabkota: city,
      bulan: month,
      tahun: year,
    }),
  });
  if (!response.ok) throw new Error("Failed to fetch prayer schedule");
  return await response.json();
}

/**
 * Performs reverse geocoding to get city and province from coordinates.
 */
export async function fetchReverseGeocode(lat: number, lon: number) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
  if (!response.ok) throw new Error("Failed to reverse geocode");
  return await response.json();
}
