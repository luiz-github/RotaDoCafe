import { VALE_DO_CAFE_QUERY } from './queries'
import { getCache, setCache, validateCache } from '../cache/cacheManager'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

const CACHE_KEY = process.env.EXPO_PUBLIC_CACHE_KEY
const baseUrl = process.env.EXPO_PUBLIC_OVERPASS_API_URL

let memoryCache = null

const mapOverpassElement = (el) => ({
  id: el.id,
  latitude: el.lat || el.center?.lat,
  longitude: el.lon || el.center?.lon,
  name: el.tags?.name || 'Sem nome',
  tags: el.tags,
})

const isValidPlacesPayload = (payload) => {
  return (
    Array.isArray(payload) &&
    payload.every((place) => {
      return typeof place?.latitude === 'number' && typeof place?.longitude === 'number'
    })
  )
}

const readCachedPlaces = async () => {
  if (isValidPlacesPayload(memoryCache)) {
    return memoryCache
  }

  const cached = await getCache(CACHE_KEY)
  const cachedData = cached?.data ?? null

  if (isValidPlacesPayload(cachedData)) {
    memoryCache = cachedData
    return cachedData
  }

  return null
}

const fetchFreshPlaces = async () => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    body: VALE_DO_CAFE_QUERY,
  })

  if (!response.ok) {
    throw new Error(`Unexpected api response (${response.status})`)
  }

  const json = await response.json()
  const filteredData = (json?.elements ?? [])
    .map(mapOverpassElement)
    .filter((place) => place.latitude && place.longitude)

  memoryCache = filteredData
  await setCache(CACHE_KEY, filteredData)

  return filteredData
}

const fetchPlacesFromDatabase = async () => {
  try {
    const placesCollection = collection(db, 'places')
    const snapshot = await getDocs(placesCollection)

    if (snapshot.empty) {
      return null
    }

    const placesFromDb = snapshot.docs.map((doc) => ({
      id: doc.data().id,
      latitude: doc.data().latitude,
      longitude: doc.data().longitude,
      name: doc.data().name,
      tags: doc.data().tags,
    }))

    if (isValidPlacesPayload(placesFromDb)) {
      memoryCache = placesFromDb
      await setCache(CACHE_KEY, placesFromDb)
      return placesFromDb
    }

    return null
  } catch (error) {
    console.warn('Erro ao buscar places do banco:', error?.message ?? error)
    return null
  }
}

export default async function getPlaces() {
  try {
    const cachedPlaces = await readCachedPlaces()

    if (cachedPlaces && (await validateCache(CACHE_KEY))) {
      return cachedPlaces
    }

    const freshPlaces = await fetchFreshPlaces()

    return freshPlaces
  } catch (error) {
    console.warn('Erro ao consultar API:', error?.message ?? error)

    const cachedPlaces = await readCachedPlaces()

    if (cachedPlaces) {
      return cachedPlaces
    }

    const dbPlaces = await fetchPlacesFromDatabase()

    if (dbPlaces) {
      return dbPlaces
    }

    console.error('❌ Não foi possível carregar places de nenhuma fonte')
    return []
  }
}
