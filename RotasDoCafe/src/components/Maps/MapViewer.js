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

export default function Map({ selectedPlace, selectedRoute, setSelectedRoute }) {
  const { location, status, canAskAgain, requestPermission } = useLocation()
  const { places } = usePlaces()

  const [realRoute, setRealRoute] = useState([])
  const [highlightRoute, setHighlightRoute] = useState([])
  const [displayRoute, setDisplayRoute] = useState(null)
  const [selectedRoutePoint, setSelectedRoutePoint] = useState(0)

  const mapRef = useRef(null)
  const routeMarkersRef = useRef([])
  const selectedMarkerRef = useRef(null)

  const selectedPlaceMapData = useMemo(() => {
    if (!selectedPlace) return null
    return enrichPlace(selectedPlace, location)
  }, [selectedPlace, location])

  useEffect(() => {
    async function loadRoute() {
      if (!selectedRoute || !location) {
        setRealRoute([])
        setDisplayRoute(null)
        return
      }

      const routeWithUser = {
        ...selectedRoute,
        places: [
          {
            name: 'Minha localização',
            latitude: location.latitude,
            longitude: location.longitude,
            isUser: true,
          },
          ...selectedRoute.places,
        ],
      }

      setDisplayRoute(routeWithUser)
      setRealRoute(
        routeWithUser.places.map((p) => ({
          latitude: p.latitude,
          longitude: p.longitude,
        }))
      )

      try {
        const route = await getRoutePath(routeWithUser.places)
        setRealRoute(route)
      } catch (error) {
        console.log('Erro rota:', error)
      }
    }

    loadRoute()
  }, [selectedRoute, location])

  useEffect(() => {
    async function loadHighlightRoute() {
      if (!displayRoute || selectedRoutePoint === 0) {
        setHighlightRoute([])
        return
      }

      try {
        const user = displayRoute.places[0]
        const destination = displayRoute.places[selectedRoutePoint]
        const route = await getRoutePath([user, destination])
        setHighlightRoute(route)
      } catch (error) {
        console.log('Erro highlight:', error)
        setHighlightRoute([])
      }
    }

    loadHighlightRoute()
  }, [displayRoute, selectedRoutePoint])

  useEffect(() => {
    if (displayRoute) {
      setSelectedRoutePoint(0)
    }
  }, [displayRoute])

  useEffect(() => {
    if (!displayRoute) return

    const point = displayRoute.places[selectedRoutePoint]
    if (!point || !mapRef.current) return

    mapRef.current.animateToRegion(
      {
        latitude: point.latitude,
        longitude: point.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500
    )

    setTimeout(() => {
      routeMarkersRef.current[selectedRoutePoint]?.showCallout()
    }, 500)
  }, [selectedRoutePoint, displayRoute])

  useEffect(() => {
    if (displayRoute && realRoute.length > 0) {
      mapRef.current?.fitToCoordinates(realRoute, {
        edgePadding: { top: 120, bottom: 180, left: 100, right: 100 },
        animated: true,
      })
      return
    }

    if (selectedPlaceMapData && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: selectedPlaceMapData.latitude,
          longitude: selectedPlaceMapData.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        },
        700
      )

      setTimeout(() => {
        selectedMarkerRef.current?.showCallout()
      }, 850)
    }
  }, [displayRoute, realRoute, selectedPlaceMapData])

  const handlePermission = async () => {
    if (canAskAgain) {
      await requestPermission()
    } else {
      Linking.openSettings()
    }
  }

  const resetRoute = () => {
    setRealRoute([])
    setHighlightRoute([])
    setDisplayRoute(null)
    setSelectedRoutePoint(0)

    if (setSelectedRoute) {
      setSelectedRoute(null)
    }

    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        },
        500
      )
    }
  }

  return (
    <View style={styles.container}>
      {status !== 'granted' && (
        <View className="absolute top-5 self-center bg-black/70 px-4 py-3 rounded-xl z-10">
          <Text className="text-white">📍 Ative localização</Text>
          <Pressable onPress={handlePermission}>
            <Text>Permitir</Text>
          </Pressable>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        showsMyLocationButton={false}
        initialRegion={{
          latitude: location?.latitude ?? -22.43,
          longitude: location?.longitude ?? -43.73,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            pinColor={colors.danger}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
          />
        ))}

        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            pinColor="#228dff"
            title="Sua localização"
          />
        )}

        {displayRoute?.places.map((place, index) => {
          const selected = selectedRoutePoint === index

          return (
            <Marker
              key={`route-${index}-${selectedRoutePoint}`}
              ref={(ref) => {
                routeMarkersRef.current[index] = ref
              }}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              pinColor={
                place.isUser ? '#228dff' : selected ? '#22c55e' : '#fbbf24'
              }
              title={
                place.isUser
                  ? 'Sua localização'
                  : `${index + 1}. ${place.name}`
              }
              onPress={() => setSelectedRoutePoint(index)}
            />
          )
        })}

        {selectedPlaceMapData && (
          <Marker
            ref={selectedMarkerRef}
            pinColor={colors.warning}
            coordinate={{
              latitude: selectedPlaceMapData.latitude,
              longitude: selectedPlaceMapData.longitude,
            }}
            title={selectedPlaceMapData.title}
          />
        )}

        {realRoute.length > 0 && (
          <Polyline
            coordinates={realRoute}
            strokeWidth={8}
            strokeColor="#228dff"
            lineCap="round"
            lineJoin="round"
          />
        )}

        {highlightRoute.length > 0 && (
          <Polyline
            coordinates={highlightRoute}
            strokeWidth={5}
            strokeColor="#22c55e"
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      <RouteInfoCard
        route={displayRoute}
        selectedIndex={selectedRoutePoint}
        onSelect={setSelectedRoutePoint}
        onClose={resetRoute}
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
