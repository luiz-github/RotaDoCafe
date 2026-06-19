import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { suggestedRoutes } from "../../data/suggestedRoutes";

export default function SuggestedRouteCard({ onPress }) {
    const [routeIndex, setRouteIndex] = useState(0);

    const intervalRef = useRef(null);
    const resumeTimeoutRef = useRef(null);
    const pausedRef = useRef(false);

    const startAuto = () => {
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (pausedRef.current) return;

            setRouteIndex((prev) =>
                (prev + 1) % suggestedRoutes.length
            );
        }, 15000);
    };

    const pauseTemporarily = () => {
        pausedRef.current = true;

        clearTimeout(resumeTimeoutRef.current);

        resumeTimeoutRef.current = setTimeout(() => {
            pausedRef.current = false;
        }, 10000);
    };

    const next = () => {
        setRouteIndex((prev) =>
            (prev + 1) % suggestedRoutes.length
        );
    };

    const prev = () => {
        setRouteIndex((prev) =>
            prev === 0
                ? suggestedRoutes.length - 1
                : prev - 1
        );
    };

    const onGestureStateChange = (event) => {
        const { state, translationX } = event.nativeEvent;

        if (state === State.END) {
            const threshold = 60;

            if (translationX < -threshold) {
                pauseTemporarily();
                next();
            }

            if (translationX > threshold) {
                pauseTemporarily();
                prev();
            }
        }
    };

    useEffect(() => {
        startAuto();

        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(resumeTimeoutRef.current);
        };
    }, []);

    const route = suggestedRoutes[routeIndex];

    return (
        <PanGestureHandler onHandlerStateChange={onGestureStateChange}>
            <View>
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
                            {route.places
                                .map((place) => place.name)
                                .join(" → ")}
                        </Text>

                        <Text className="text-yellow-200 mt-3 text-xs">
                            Toque para visualizar a rota no mapa
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </PanGestureHandler>
    );
}