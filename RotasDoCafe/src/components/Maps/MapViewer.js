import MapView, { UrlTile, Marker } from 'react-native-maps'
import { View, StyleSheet, Text, Pressable } from 'react-native'
import { useEffect, useMemo, useRef } from 'react'
import usePlaces from '../../hooks/MapScreen/usePlaces'
import colors from '../../styles/colors'
import useLocation from '../../hooks/MapScreen/useLocation'
import * as Linking from 'expo-linking'
import { enrichPlace } from '../../utils/places'

export default function Map({ selectedPlace }) {
  const { location, status, canAskAgain, requestPermission } = useLocation()

  const baseUrlTemplate = process.env.EXPO_PUBLIC_OPENSTREETMAP_API_URL

  const { places } = usePlaces()

  const mapRef = useRef(null)
  const selectedMarkerRef = useRef(null)

  const selectedPlaceMapData = useMemo(() => {
    if (!selectedPlace) {
      return null
    }

    return enrichPlace(selectedPlace, location)
  }, [location, selectedPlace])

  useEffect(() => {
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
  }, [selectedPlaceMapData])

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
          latitude: selectedPlaceMapData?.latitude ?? location?.latitude ?? -22.43,
          longitude: selectedPlaceMapData?.longitude ?? location?.longitude ?? -43.73,
          latitudeDelta: selectedPlaceMapData ? 0.08 : 1.5,
          longitudeDelta: selectedPlaceMapData ? 0.08 : 1.5,
        }}
      >
        {/* <UrlTile urlTemplate={`${baseUrlTemplate}/{z}/{x}/{y}.png`} /> */}

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
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  map: { flex: 1, width: '100%', height: '100%' },
})
