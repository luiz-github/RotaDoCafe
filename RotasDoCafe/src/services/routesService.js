const BASE_URL = process.env.EXPO_PUBLIC_OPENSTREETMAP_ROUTER_URL

export async function getRoutePath(places) {
  if (!places || places.length < 2) {
    return []
  }

  const coordinates = places.map((place) => `${place.longitude},${place.latitude}`).join(';')

  const response = await fetch(`${BASE_URL}/${coordinates}?overview=full&geometries=geojson`)

  const data = await response.json()

  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error('Erro ao gerar rota')
  }

  return data.routes[0].geometry.coordinates.map(([longitude, latitude]) => ({
    latitude,
    longitude,
  }))
}
