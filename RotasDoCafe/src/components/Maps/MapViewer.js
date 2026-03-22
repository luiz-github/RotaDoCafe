import MapView, { UrlTile, Marker } from 'react-native-maps';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import usePlaces from '../../hooks/MapScreen/usePlaces';
import colors from '../../styles/colors';
import useLocation from '../../hooks/MapScreen/useLocation';
import * as Linking from 'expo-linking';

export default function Map() {
  const { location, status, canAskAgain, requestPermission } = useLocation()
  const baseUrlTemplate = process.env.EXPO_PUBLIC_OPENSTREETMAP_API_URL
  const places = usePlaces()

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
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={false} 
        initialRegion={{
            latitude: location?.latitude ?? -22.43,
            longitude: location?.longitude ?? -43.73,
            latitudeDelta: 1.5,
            longitudeDelta: 1.5,
        }}

      >
        <UrlTile urlTemplate={`${baseUrlTemplate}/{z}/{x}/{y}.png`} />
        {places.map(place => (
          <Marker
            key={place.id}
            pinColor={colors.danger}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.tags.inscription || null}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  map: { flex: 1, width: '100%',height: '100%'},
});