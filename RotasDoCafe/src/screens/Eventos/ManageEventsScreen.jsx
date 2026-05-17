import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useEvents } from "../../hooks/EventScreen/useEvents";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SwipeableCard from "../../components/SwipeableCard/SwipeableCard";

export default function ManageEventsScreen({ navigation }) {
  const { events, loading, deleteEvent, fetchEvents } = useEvents();

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

        <SwipeableCard
          events={events}
          loading={loading}
          deleteEvent={deleteEvent}
          navigation={navigation}
        />

      </ScrollView>
    </SafeAreaView>
  );
}