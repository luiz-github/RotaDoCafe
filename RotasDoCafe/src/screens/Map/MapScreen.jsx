import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "../../components/Maps/MapViewer"

export default function MapScreen({ route }) {
    const selectedPlace = route?.params?.selectedPlace ?? null

    return (
        <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-coffee items-center justify-center">
            <MapView selectedPlace={selectedPlace} />
        </SafeAreaView>
    );
}