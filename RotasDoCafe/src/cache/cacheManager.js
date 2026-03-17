import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_TTL = 24 * 60 * 60 * 1000;

async function getCache(cache_key) {
    const raw = await AsyncStorage.getItem(cache_key);
    if (!raw) return null;
    return JSON.parse(raw);
}

async function setCache(cache_key, data) {
    await AsyncStorage.setItem(
        cache_key,
        JSON.stringify({ timestamp: Date.now(), data })
    );
}

async function validateCache(cache_key) {
    const cached = await getCache(cache_key);
    if (!cached) return false;
    return (Date.now() - cached.timestamp) < CACHE_TTL;
}

export { getCache, setCache, validateCache };