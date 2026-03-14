import {View, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapaScreen() {
    return (
        <SafeAreaView className="flex-1 bg-coffee items-center justify-center">
            <Text className="text-white text-xl font-bold">
                Mapa
            </Text>
        </SafeAreaView>
    );
}