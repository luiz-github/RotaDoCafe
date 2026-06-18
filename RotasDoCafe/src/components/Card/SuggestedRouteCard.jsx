import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { suggestedRoutes } from "../../data/suggestedRoutes";

export default function SuggestedRouteCard({ onPress }) {
    const [routeIndex, setRouteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRouteIndex((prev) => (prev + 1) % suggestedRoutes.length);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const route = suggestedRoutes[routeIndex];

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress(route)}
        >
            <LinearGradient
                colors={route.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    borderRadius: 24,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.15)",
                }}
                className="p-6 mb-8"
            >
                <Text className="text-white text-lg font-bold mb-2">
                    {route.icon} {route.title}
                </Text>

                <Text className="text-gray-200">
                    {route.places.map(place => place.name).join(" → ")}
                </Text>

                <Text className="text-yellow-200 mt-3 text-xs">
                    Toque para visualizar a rota no mapa
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}