import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "../../components/Maps/MapViewer"

export default function MapScreen({ route }) {
    const paramPlace = route?.params?.selectedPlace ?? null
    const paramRoute = route?.params?.selectedRoute ?? null
    const paramTs = route?.params?._ts ?? null
    const paramTsPlace = route?.params?._tsPlace ?? null

    const [selectedRoute, setSelectedRoute] = useState(null)
    const [selectedPlace, setSelectedPlace] = useState(null)

    useEffect(() => {
        if (paramRoute) {
            setSelectedPlace(null)
            setSelectedRoute({ ...paramRoute })
        }
    }, [paramTs])

    useEffect(() => {
        if (paramPlace) {
            setSelectedRoute(null)
            setSelectedPlace({ ...paramPlace })
        }
    }, [paramTsPlace])

    return (
        <SafeAreaView testID="map-screen" edges={['top', 'left', 'right']} className="flex-1 bg-coffee items-center justify-center">
            <MapView
                selectedPlace={selectedPlace}
                selectedRoute={selectedRoute}
                setSelectedRoute={setSelectedRoute}
                setSelectedPlace={setSelectedPlace}
            />
        </SafeAreaView>
    );
}
