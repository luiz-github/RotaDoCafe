import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDateTime } from "../../utils/date";
import { Ionicons } from "@expo/vector-icons";

export default function EventDetailsScreen({ route, navigation }) {
    const { event } = route.params;

    const { date, time } = formatDateTime(event.date);

    return (
        <SafeAreaView
            testID="event-details-screen"
            edges={["top", "left", "right"]}
            className="flex-1 bg-coffee"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: 60,
                }}
            >
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-3"
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text className="text-white text-2xl font-bold">
                        Detalhes do Evento
                    </Text>
                </View>
                <View className="bg-white/10 rounded-3xl p-6">

                    <View className="flex-row flex-wrap gap-2 mb-4">

                        <View
                            className={`px-3 py-1 rounded-full ${event.is_free
                                ? "bg-green-500/20"
                                : "bg-yellow-500/20"
                                }`}
                        >
                            <Text
                                className={`font-semibold ${event.is_free
                                    ? "text-green-400"
                                    : "text-yellow-400"
                                    }`}
                            >
                                {event.is_free
                                    ? "Gratuito"
                                    : `R$ ${Number(event.price ?? 0)
                                        .toFixed(2)
                                        .replace(".", ",")}`}
                            </Text>
                        </View>

                        <View className="bg-white/10 px-3 py-1 rounded-full">
                            <Text className="text-gray-300">
                                {event.age_rating || "Livre"}
                            </Text>
                        </View>

                    </View>

                    <Text className="text-white text-3xl font-bold mb-3">
                        {event.title}
                    </Text>

                    <Text className="text-gray-300 text-base mb-2">
                        📅 {date}
                    </Text>

                    <Text className="text-gray-300 text-base mb-2">
                        🕒 {time}
                    </Text>

                    <Text className="text-gray-300 text-base mb-2">
                        📍 {event.location}
                    </Text>

                    <Text className="text-gray-300 text-base mb-2">
                        🏙️ {event.city} - {event.state}
                    </Text>

                    <View className="border-t border-white/10 pt-5 mb-5">
                        <Text className="text-white text-xl font-semibold mb-3">
                            Sobre o evento
                        </Text>

                        <Text className="text-gray-300 leading-6">
                            {event.description}
                        </Text>
                    </View>

                    {event.schedule && (
                        <View className="border-t border-white/10 pt-5 mb-5">

                            <Text className="text-white text-xl font-semibold mb-3">
                                Programação
                            </Text>

                            <Text className="text-gray-300 leading-6">
                                {event.schedule}
                            </Text>

                        </View>
                    )}

                    <View className="border-t border-white/10 pt-5">

                        <Text className="text-white text-xl font-semibold mb-3">
                            Informações
                        </Text>

                        <Text className="text-gray-300 mb-2">
                            Organizador: {event.organizer}
                        </Text>

                        <Text className="text-gray-300">
                            Classificação: {event.age_rating || "Livre"}
                        </Text>

                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}