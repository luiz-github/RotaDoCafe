import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export default function useLocation() {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            const { coords } = await Location.getCurrentPositionAsync({});
            setLocation(coords);
        })();
    }, []);

    return location;
}