import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AdminScreen({ navigation }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-coffee">
      <ScrollView className="p-6">

        <Text className="text-white text-3xl font-bold mb-2">
          Painel Admin
        </Text>

        <Text className="text-gray-300 mb-6">
          Gerencie o sistema
        </Text>

        <View className="flex-row flex-wrap justify-between">

          <TouchableOpacity
            onPress={() => navigation.navigate("ManageEvents")}
            className="bg-white/10 w-[48%] p-5 rounded-2xl mb-4"
          >
            <Ionicons name="calendar" size={28} color="#fbbf24" />

            <Text className="text-white mt-3 font-semibold">
              Eventos
            </Text>

            <Text className="text-gray-400 text-xs mt-1">
              Gerenciar Eventos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white/10 w-[48%] p-5 rounded-2xl mb-4 opacity-50">
            <Ionicons name="people" size={28} color="#94a3b8" />

            <Text className="text-white mt-3 font-semibold">
              Usuários
            </Text>

            <Text className="text-gray-400 text-xs mt-1">
              Em breve
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}