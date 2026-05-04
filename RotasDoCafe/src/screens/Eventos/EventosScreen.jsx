import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvents } from "../../hooks/EventScreen/useEvents";
import { formatDateTime } from "../../utils/date";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function EventosScreen() {
  const { events, loading, fetchEvents } = useEvents();

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-coffee">

      <ScrollView
        className="px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >

        <Text className="text-white text-3xl font-bold mb-2">
          Eventos
        </Text>

        <Text className="text-gray-300 mb-6">
          Viva experiências no Vale do Café ☕
        </Text>

        {loading && (
          <Text className="text-gray-400">Carregando eventos...</Text>
        )}

        {!loading && events.length === 0 && (
          <Text className="text-gray-400">
            Nenhum evento encontrado.
          </Text>
        )}

        {!loading && events.map((event) => {
          const { date, time } = formatDateTime(event.date);

          return (
            <TouchableOpacity
              key={event.id}
              className="bg-white/10 rounded-2xl mb-4 overflow-hidden active:opacity-80"
            >

              <View className="p-4 pb-2 flex-row justify-between items-center">

                <View className="flex-row gap-2">

                  <View className={`px-3 py-1 rounded-full ${
                    event.is_free ? "bg-green-500/20" : "bg-yellow-500/20"
                  }`}>
                    <Text className={`text-xs font-semibold ${
                      event.is_free ? "text-green-400" : "text-yellow-400"
                    }`}>
                      {event.is_free ? "Gratuito" : `R$ ${event.price ?? 0}`}
                    </Text>
                  </View>

                  <View className="bg-white/10 px-3 py-1 rounded-full">
                    <Text className="text-xs text-gray-300">
                      {event.age_rating || "Livre"}
                    </Text>
                  </View>

                </View>

                <Text className="text-gray-400 text-xs">
                  {date}
                </Text>
              </View>

              <View className="px-4 pb-4">

                <Text className="text-white text-lg font-semibold mb-1">
                  {event.title}
                </Text>

                <Text className="text-gray-400 text-sm mb-2">
                  📍 {event.city} • {time}
                </Text>

                <Text numberOfLines={2} className="text-gray-300 text-sm">
                  {event.description}
                </Text>

              </View>

            </TouchableOpacity>
          );
        })}

      </ScrollView>

    </SafeAreaView>
  );
}