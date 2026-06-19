import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { suggestedRoutes } from "../../data/suggestedRoutes";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SuggestedRouteCard({ onPress }) {
    const [routeIndex, setRouteIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const intervalRef = useRef(null);
    const resumeTimeoutRef = useRef(null);
    const pausedRef = useRef(false);

    const animateTransition = (callback) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            callback();

            LayoutAnimation.configureNext(
                LayoutAnimation.create(300, "easeInEaseOut", "opacity")
            );

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    const startAuto = () => {
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (pausedRef.current) return;

            animateTransition(() => {
                setRouteIndex((prev) =>
                    (prev + 1) % suggestedRoutes.length
                );
            });
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
        animateTransition(() => {
            setRouteIndex((prev) =>
                (prev + 1) % suggestedRoutes.length
            );
        });
    };

    const prev = () => {
        animateTransition(() => {
            setRouteIndex((prev) =>
                prev === 0
                    ? suggestedRoutes.length - 1
                    : prev - 1
            );
        });
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
                    testID="suggested-route-card"
                    activeOpacity={0.9}
                    onPress={() => onPress(route)}
                >
                    <Animated.View style={{ opacity: fadeAnim }}>
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
                            className="p-6 mb-4"
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
                                Deslize para ver mais rotas
                            </Text>
                        </LinearGradient>
                    </Animated.View>
                </TouchableOpacity>

                {/* Indicadores de slide */}
                <View className="flex-row justify-center items-center mb-8 gap-2">
                    {suggestedRoutes.map((_, index) => (
                        <View
                            key={index}
                            className={`rounded-full ${
                                index === routeIndex
                                    ? "w-6 h-2 bg-amber-400"
                                    : "w-2 h-2 bg-white/30"
                            }`}
                        />
                    ))}
                </View>
            </View>
        </PanGestureHandler>
    );
}
