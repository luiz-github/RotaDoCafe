import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useEvents } from "../../hooks/EventScreen/useEvents";
import { formatDateTime } from "../../utils/date";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function ManageEventsScreen({ navigation }) {
  const { events, loading, deleteEvent, fetchEvents } = useEvents();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // 🔥 ISSO RESOLVE
  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-coffee">

      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-xl font-bold ml-4">
          Gerenciar Eventos
        </Text>
      </View>

      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 80 }}
      >

        <TouchableOpacity
          onPress={() => navigation.navigate("CreateEvent")}
          className="bg-amber-400 p-4 rounded-xl mb-6"
        >
          <Text className="text-black text-center font-semibold">
            Criar Evento
          </Text>
        </TouchableOpacity>

        {loading && (
          <Text className="text-gray-400">Carregando...</Text>
        )}

        {!loading && events.map((event) => {
          const { date, time } = formatDateTime(event.date);
          const isConfirming = confirmDeleteId === event.id;

          return (
            <View key={event.id} className="bg-white/10 p-4 rounded-xl mb-4">

              <Text className="text-white font-semibold text-lg">
                {event.title}
              </Text>

              <Text className="text-gray-400 text-sm">
                📍 {event.city} • {date} às {time}
              </Text>

              <View className="flex-row gap-3 mt-4">

                <TouchableOpacity
                  onPress={() => navigation.navigate("EditEvent", { event })}
                  className="flex-1 bg-blue-500 p-2 rounded"
                >
                  <Text className="text-white text-center">
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    if (!isConfirming) {
                      setConfirmDeleteId(event.id);
                      setTimeout(() => setConfirmDeleteId(null), 3000);
                      return;
                    }

                    const success = await deleteEvent(event.id);
                    if (success) fetchEvents();

                    setConfirmDeleteId(null);
                  }}
                  className={`flex-1 p-2 rounded ${
                    isConfirming ? "bg-red-700" : "bg-red-500"
                  }`}
                >
                  <Text className="text-white text-center">
                    {isConfirming ? "Confirmar" : "Deletar"}
                  </Text>
                </TouchableOpacity>

              </View>

            </View>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}