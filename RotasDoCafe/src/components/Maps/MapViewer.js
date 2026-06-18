import { useEffect, useMemo, useRef, useState } from 'react'
import { View, StyleSheet, Text, Pressable } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import * as Linking from 'expo-linking'

import usePlaces from '../../hooks/MapScreen/usePlaces'
import useLocation from '../../hooks/MapScreen/useLocation'
import colors from '../../styles/colors'
import { enrichPlace } from '../../utils/places'
import { getRoutePath } from '../../services/routesService'
import RouteInfoCard from '../Card/RouteInfoCard'

export default function Map({ selectedPlace, selectedRoute }) {
  const { location, status, canAskAgain, requestPermission } = useLocation()
  const { places } = usePlaces()

  const [realRoute, setRealRoute] = useState([])
  const [selectedRoutePoint, setSelectedRoutePoint] = useState(0)

  const mapRef = useRef(null)
  const routeMarkersRef = useRef([])
  const selectedMarkerRef = useRef(null)

  const selectedPlaceMapData = useMemo(() => {
    if (!selectedPlace) return null
    return enrichPlace(selectedPlace, location)
  }, [location, selectedPlace])

  const routeCoordinates = useMemo(() => {
    if (!selectedRoute) return []
    return selectedRoute.places.map((place) => ({
      latitude: place.latitude,
      longitude: place.longitude,
    }))
  }, [selectedRoute])

  useEffect(() => {
    async function loadRoute() {
      if (!selectedRoute) {
        setRealRoute([])
        return
      }

      try {
        const route = await getRoutePath(selectedRoute.places)
        setRealRoute(route)
      } catch (error) {
        console.log('Erro ao carregar rota:', error)
      }
    }

    loadRoute()
  }, [selectedRoute])

  useEffect(() => {
    if (!selectedRoute) return

    const timeout = setTimeout(() => {
      routeMarkersRef.current[0]?.showCallout()
    }, 1000)

    return () => clearTimeout(timeout)
  }, [selectedRoute])

  useEffect(() => {
    if (selectedRoute) {
      setSelectedRoutePoint(0)
    }
  }, [selectedRoute])

  useEffect(() => {
    if (!selectedRoute) return

    const selectedPlace = selectedRoute.places[selectedRoutePoint]

    if (!selectedPlace || !mapRef.current) return

    mapRef.current.animateToRegion(
      {
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500,
    )

    setTimeout(() => {
      routeMarkersRef.current[selectedRoutePoint]?.showCallout()
    }, 500)
  }, [selectedRoutePoint, selectedRoute])

  useEffect(() => {
    if (selectedRoute && mapRef.current && routeCoordinates.length > 0) {
      mapRef.current.fitToCoordinates(realRoute.length > 0 ? realRoute : routeCoordinates, {
        edgePadding: {
          top: 100,
          right: 100,
          bottom: 100,
          left: 100,
        },
        animated: true,
      })
      return
    }

    if (!mapRef.current || !selectedPlaceMapData?.latitude || !selectedPlaceMapData?.longitude) {
      return
    }

    mapRef.current.animateToRegion(
      {
        latitude: selectedPlaceMapData.latitude,
        longitude: selectedPlaceMapData.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      },
      700,
    )

    const timeout = setTimeout(() => {
      selectedMarkerRef.current?.showCallout()
    }, 850)

    return () => clearTimeout(timeout)
  }, [selectedPlaceMapData, selectedRoute, routeCoordinates, realRoute])

  const handlePermission = async () => {
    if (canAskAgain) {
      await requestPermission()
    } else {
      Linking.openSettings()
    }
  }

  return (
    <View style={styles.container}>
      {status !== 'granted' && (
        <View className="absolute top-5 self-center bg-black/70 px-4 py-3 rounded-xl z-10 items-center gap-2">
          <Text className="text-white text-sm text-center">
            📍 Ative a localização para ver lugares próximos
          </Text>

          <Pressable onPress={handlePermission} className="bg-yellow-400 px-3 py-1 rounded-lg">
            <Text className="text-black font-semibold text-sm">
              {canAskAgain ? 'Permitir localização' : 'Abrir configurações'}
            </Text>
          </Pressable>
        </View>
      )}

      <MapView
        testID="map-screen"
        ref={mapRef}
        style={styles.map}
        showsUserLocation={false}
        followsUserLocation={false}
        initialRegion={{
          latitude:
            selectedPlaceMapData?.latitude ??
            routeCoordinates[0]?.latitude ??
            location?.latitude ??
            -22.43,

          longitude:
            selectedPlaceMapData?.longitude ??
            routeCoordinates[0]?.longitude ??
            location?.longitude ??
            -43.73,

          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
      >
        {location && (
          <Marker
            key="userLocation"
            pinColor="#228dff"
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Sua localização"
          />
        )}

        {places.map((place) => (
          <Marker
            key={place.id}
            pinColor={colors.danger}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.tags.inscription || undefined}
          />
        ))}

        {selectedPlaceMapData && (
          <Marker
            ref={selectedMarkerRef}
            key={`selected-${selectedPlaceMapData.id}`}
            pinColor={colors.warning}
            coordinate={{
              latitude: selectedPlaceMapData.latitude,
              longitude: selectedPlaceMapData.longitude,
            }}
            title={selectedPlaceMapData.title}
            description={selectedPlaceMapData.locationLabel}
          />
        )}

        {selectedRoute?.places.map((place, index) => {
          const isSelected = selectedRoutePoint === index

          return (
            <Marker
              ref={(ref) => {
                routeMarkersRef.current[index] = ref
              }}
              key={`route-${index}-${selectedRoutePoint}`}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              pinColor={isSelected ? '#22c55e' : '#fbbf24'}
              title={`${index + 1}. ${place.name}`}
              onPress={() => setSelectedRoutePoint(index)}
            />
          )
        })}

        {realRoute.length > 0 && (
          <Polyline
            coordinates={realRoute}
            strokeWidth={6}
            strokeColor="#fbbf24"
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      <RouteInfoCard
        route={selectedRoute}
        selectedIndex={selectedRoutePoint}
        onSelect={setSelectedRoutePoint}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
})
