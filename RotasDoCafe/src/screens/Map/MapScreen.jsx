import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "../../components/Maps/MapViewer"

export default function MapScreen({ route }) {
    const selectedPlace = route?.params?.selectedPlace ?? null
    const paramRoute = route?.params?.selectedRoute ?? null
    const paramTs = route?.params?._ts ?? null

    const [selectedRoute, setSelectedRoute] = useState(null)

    useEffect(() => {
        if (paramRoute) {
            setSelectedRoute({ ...paramRoute })
        }
    }, [paramTs])

    return (
        <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-coffee items-center justify-center">
            <MapView
                selectedPlace={selectedPlace}
                selectedRoute={selectedRoute}
                setSelectedRoute={setSelectedRoute}
            />
        </SafeAreaView>
    );
}
