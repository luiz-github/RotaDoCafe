import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "../../components/Maps/MapViewer"

export default function MapScreen() {
    return (
        <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-coffee items-center justify-center">
            <MapView/>
        </SafeAreaView>
    );
}