const categories = [
  { key: 'historico', name: 'Histórico', icon: '🏛️' },
  { key: 'mirantes', name: 'Mirantes', icon: '🔭' },
  { key: 'museus_cultura', name: 'Museus & Cultura', icon: '🏺' },
  { key: 'natureza', name: 'Natureza', icon: '🌿' },
  { key: 'religioso', name: 'Religioso', icon: '⛪' },
  { key: 'fazendas', name: 'Fazendas', icon: '🚜' },
  { key: 'turismo_lazer', name: 'Turismo & Lazer', icon: '🎡' },
]

const recommendationWeights = {
  mirantes: 2,
  natureza: 2,
  museus_cultura: 1.8,
  historico: 1.7,
  fazendas: 1.5,
  religioso: 1.4,
  turismo_lazer: 1.3,
}

const categoryNames = {
  historico: 'Histórico',
  mirantes: 'Mirantes',
  museus_cultura: 'Museus & Cultura',
  natureza: 'Natureza',
  religioso: 'Religioso',
  fazendas: 'Fazendas',
  turismo_lazer: 'Turismo & Lazer',
}

const normalizeText = (value) => value?.toString().trim().toLowerCase() || ''

const containsAny = (value, candidates) => {
  return candidates.some((candidate) => value.includes(candidate))
}

const getPlaceTitle = (place) => place?.name || place?.tags?.name || 'Sem nome'

const getPlaceLocationLabel = (place) => {
  const city =
    place?.tags?.['addr:city'] || place?.tags?.['addr:town'] || place?.tags?.['addr:municipality']
  const suburb = place?.tags?.['addr:suburb']
  const state = place?.tags?.['addr:state'] || 'RJ'

  if (city) {
    if (suburb) {
      return `${suburb}, ${city} - ${state}`
    }

    return `${city} - ${state}`
  }

  if (place?.latitude && place?.longitude) {
    return `${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`
  }

  return 'Vale do Café'
}

const getPlaceCategoryKey = (place) => {
  const amenity = normalizeText(place?.tags?.amenity)
  const cuisine = normalizeText(place?.tags?.cuisine)
  const tourism = normalizeText(place?.tags?.tourism)
  const historic = normalizeText(place?.tags?.historic)
  const leisure = normalizeText(place?.tags?.leisure)
  const naturalTag = normalizeText(place?.tags?.natural)
  const waterway = normalizeText(place?.tags?.waterway)
  const building = normalizeText(place?.tags?.building)
  const religion = normalizeText(place?.tags?.religion)
  const manMade = normalizeText(place?.tags?.man_made)
  const placeType = normalizeText(place?.tags?.place)
  const name = normalizeText(getPlaceTitle(place))

  const text = [
    name,
    place?.tags?.tourism,
    place?.tags?.historic,
    place?.tags?.amenity,
    place?.tags?.cuisine,
    place?.tags?.leisure,
    place?.tags?.place,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (
    tourism === 'viewpoint' ||
    containsAny(name, ['mirante', 'viewpoint', 'torre']) ||
    manMade === 'tower'
  ) {
    return 'mirantes'
  }

  if (
    amenity === 'place_of_worship' ||
    building === 'church' ||
    religion.includes('christian') ||
    containsAny(name, [
      'igreja',
      'capela',
      'catedral',
      'santuario',
      'santuário',
      'gruta',
      'nossa senhora',
      'sao jorge',
      'são jorge',
    ])
  ) {
    return 'religioso'
  }

  if (containsAny(name, ['fazenda', 'farm', 'engenho'])) {
    return 'fazendas'
  }

  if (
    tourism === 'museum' ||
    tourism === 'gallery' ||
    tourism === 'artwork' ||
    amenity === 'arts_centre' ||
    amenity === 'theatre' ||
    containsAny(name, ['museu', 'centro cultural', 'casa de cultura', 'cultura'])
  ) {
    return 'museus_cultura'
  }

  if (
    waterway === 'waterfall' ||
    naturalTag === 'waterfall' ||
    naturalTag === 'peak' ||
    naturalTag === 'wood' ||
    naturalTag === 'forest' ||
    leisure === 'nature_reserve' ||
    leisure === 'park' ||
    leisure === 'garden' ||
    tourism === 'camp_site' ||
    tourism === 'picnic_site' ||
    containsAny(name, ['cachoeira', 'trilha', 'serra', 'morro'])
  ) {
    return 'natureza'
  }

  if (
    historic ||
    containsAny(name, [
      'obelisco',
      'estacao',
      'estação',
      'tunel',
      'túnel',
      'ponte',
      'chamine',
      'chaminé',
      'memorial',
      'monumento',
      'portal',
      'portico',
      'pórtico',
      'antiga estação',
      'guincho a vapor',
    ])
  ) {
    return 'historico'
  }

  if (
    tourism === 'attraction' ||
    tourism === 'theme_park' ||
    tourism === 'zoo' ||
    tourism === 'aquarium' ||
    tourism === 'yes' ||
    placeType === 'island' ||
    amenity === 'restaurant' ||
    amenity === 'fast_food' ||
    amenity === 'food_court' ||
    amenity === 'bar' ||
    amenity === 'pub' ||
    amenity === 'biergarten' ||
    amenity === 'cafe' ||
    amenity === 'coffee_shop' ||
    cuisine.includes('coffee') ||
    cuisine.includes('cafe') ||
    cuisine.includes('portuguese') ||
    text.includes('parque') ||
    text.includes('divers') ||
    text.includes('lazer') ||
    text.includes('entretenimento')
  ) {
    return 'turismo_lazer'
  }

  return 'turismo_lazer'
}

const getCategoryDefinition = (categoryKey) => {
  return categories.find((item) => item.key === categoryKey) || categories[categories.length - 1]
}

const getPlaceCategoryLabel = (place) => {
  const categoryKey = getPlaceCategoryKey(place)

  return categoryNames[categoryKey] || 'Turismo & Lazer'
}

const getPlaceIcon = (place) => {
  const categoryKey = getPlaceCategoryKey(place)

  return getCategoryDefinition(categoryKey).icon
}

const getPlaceDistanceInKm = (origin, destination) => {
  if (!origin || !destination) {
    return null
  }

  const toRadians = (value) => (value * Math.PI) / 180

  const earthRadiusKm = 6371
  const latDiff = toRadians(destination.latitude - origin.latitude)
  const lonDiff = toRadians(destination.longitude - origin.longitude)
  const originLat = toRadians(origin.latitude)
  const destinationLat = toRadians(destination.latitude)

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2) * Math.cos(originLat) * Math.cos(destinationLat)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusKm * c
}

const enrichPlace = (place, userLocation = null) => {
  const categoryKey = getPlaceCategoryKey(place)
  const distanceInKm = getPlaceDistanceInKm(userLocation, place)

  return {
    ...place,
    title: getPlaceTitle(place),
    locationLabel: getPlaceLocationLabel(place),
    categoryKey,
    category: getCategoryDefinition(categoryKey),
    icon: getPlaceIcon(place),
    distanceInKm,
  }
}

const classifyPlacesForOutput = (places) => {
  return (places || []).map((place) => ({
    id: place.id,
    name: getPlaceTitle(place),
    category: getPlaceCategoryLabel(place),
  }))
}

const sortByDistance = (places) => {
  return [...places].sort((left, right) => {
    const leftDistance = left.distanceInKm ?? Number.MAX_SAFE_INTEGER
    const rightDistance = right.distanceInKm ?? Number.MAX_SAFE_INTEGER

    return leftDistance - rightDistance
  })
}

const sortByRecommendation = (places) => {
  return [...places].sort((left, right) => {
    const leftDistance = left.distanceInKm ?? 9999
    const rightDistance = right.distanceInKm ?? 9999
    const leftWeight = recommendationWeights[left.categoryKey] ?? 1
    const rightWeight = recommendationWeights[right.categoryKey] ?? 1

    const leftScore = leftWeight + (leftDistance > 0 ? Math.max(0, 5 - leftDistance) : 0)
    const rightScore = rightWeight + (rightDistance > 0 ? Math.max(0, 5 - rightDistance) : 0)

    return rightScore - leftScore
  })
}

const buildCategorySummary = (places) => {
  return categories.map((category) => {
    const count = places.filter((place) => getPlaceCategoryKey(place) === category.key).length

    return {
      ...category,
      count,
    }
  })
}

const filterPlacesByCategory = (places, categoryKey) => {
  if (!categoryKey || categoryKey === 'all') {
    return places
  }

  return places.filter((place) => getPlaceCategoryKey(place) === categoryKey)
}

export {
  categories,
  categoryNames,
  buildCategorySummary,
  classifyPlacesForOutput,
  enrichPlace,
  filterPlacesByCategory,
  getPlaceCategoryLabel,
  getPlaceCategoryKey,
  getPlaceDistanceInKm,
  getPlaceIcon,
  getPlaceLocationLabel,
  getPlaceTitle,
  normalizeText,
  sortByDistance,
  sortByRecommendation,
}
