import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function Loading({
    visible = false,
    text = "Carregando..."
}) {
    if (!visible) return null;

    return (
        <View className="absolute inset-0 bg-black/60 items-center justify-center z-50">

            <View className="bg-coffeeDark px-8 py-6 rounded-2xl items-center shadow-lg">

                <ActivityIndicator size="large" color="#C8A27A" />

                <Text className="text-cream mt-4 text-base font-semibold">
                    {text}
                </Text>

            </View>

        </View>
    );
}