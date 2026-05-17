import { VALE_DO_CAFE_QUERY } from './queries';
import { getCache, setCache, validateCache } from '../cache/cacheManager';

const CACHE_KEY = 'VALE_DO_CAFE_PLACES';
const baseUrl = process.env.EXPO_PUBLIC_OVERPASS_API_URL;

export default async function getPlaces() {
    let staleData = null;

    try {
        const cached = await getCache(CACHE_KEY);
        if (cached) {
            staleData = cached.data;
            if (await validateCache(CACHE_KEY)) return staleData
        }
        
        const response = await fetch(baseUrl, {
            method: "POST",
            body: VALE_DO_CAFE_QUERY,
        });
        
        if (!response.ok) throw new Error("Unexpected api response.")
            
        const json = await response.json();

        const filteredData = json.elements.map((el) => ({
            id: el.id,
            latitude: el.lat || el.center?.lat,
            longitude: el.lon || el.center?.lon,
            name: el.tags?.name || "Sem nome",
            tags: el.tags,
        }));

        await setCache(CACHE_KEY, filteredData);

        return filteredData;

    } catch (error) {
        console.error("Error while fetching places:", error);
        return staleData ?? [];
    }
}