import MapView, { UrlTile, Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import usePlaces from '../../hooks/MapScreen/usePlaces';
import colors from '../../styles/colors';
import useLocation from '../../hooks/MapScreen/useLocation';

export default function Map() {
  const location = useLocation()
  const baseUrlTemplate = process.env.EXPO_PUBLIC_OPENSTREETMAP_API_URL;
  const places = usePlaces()

  return (
    <View style={styles.container}>
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