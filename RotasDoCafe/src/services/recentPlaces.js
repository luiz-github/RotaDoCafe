import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  getPlaceIcon,
  getPlaceLocationLabel,
  getPlaceTitle,
  getPlaceCategoryKey,
} from '../utils/places'

const RECENT_PLACES_STORAGE_KEY = 'recent-opened-places'
const MAX_RECENT_PLACES = 3

let memoryCache = null
const listeners = new Set()

const normalizeRecentPlace = (place) => {
  if (!place) {
    return null
  }

  return {
    id: place.id ?? `${Date.now()}`,
    latitude: place.latitude ?? null,
    longitude: place.longitude ?? null,
    name: place.name ?? place.title ?? 'Sem nome',
    tags: place.tags ?? {},
    title: getPlaceTitle(place),
    locationLabel: getPlaceLocationLabel(place),
    icon: place.icon ?? getPlaceIcon(place),
    categoryKey: place.categoryKey ?? getPlaceCategoryKey(place),
  }
}

const isValidRecentPlaces = (value) => {
  return Array.isArray(value)
}

const notifyListeners = (places) => {
  listeners.forEach((listener) => listener(places))
}

const persistRecentPlaces = async (places) => {
  try {
    await AsyncStorage.setItem(RECENT_PLACES_STORAGE_KEY, JSON.stringify(places))
  } catch (error) {
    console.warn('Erro ao salvar lugares recentes:', error?.message ?? error)
  }
}

const getRecentPlaces = async () => {
  if (isValidRecentPlaces(memoryCache)) {
    return memoryCache
  }

  try {
    const raw = await AsyncStorage.getItem(RECENT_PLACES_STORAGE_KEY)

    if (!raw) {
      memoryCache = []
      return memoryCache
    }

    const parsed = JSON.parse(raw)

    if (isValidRecentPlaces(parsed)) {
      memoryCache = parsed
      return memoryCache
    }
  } catch (error) {
    console.warn('Erro ao carregar lugares recentes:', error?.message ?? error)
  }

  memoryCache = []
  return memoryCache
}

const saveRecentPlace = async (place) => {
  const normalizedPlace = normalizeRecentPlace(place)

  if (!normalizedPlace) {
    return []
  }

  const currentPlaces = await getRecentPlaces()
  const nextPlaces = [
    normalizedPlace,
    ...currentPlaces.filter((item) => String(item.id) !== String(normalizedPlace.id)),
  ].slice(0, MAX_RECENT_PLACES)

  memoryCache = nextPlaces
  notifyListeners(nextPlaces)
  await persistRecentPlaces(nextPlaces)

  return nextPlaces
}

const subscribeRecentPlaces = (listener) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export { getRecentPlaces, saveRecentPlace, subscribeRecentPlaces }
