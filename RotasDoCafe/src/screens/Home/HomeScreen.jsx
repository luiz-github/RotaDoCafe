import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {

  return (

    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-coffee">

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
      >


        <View className="mt-10 mb-8">

          <Text className="text-4xl font-bold text-white">
            Rota do Café
          </Text>

          <Text className="text-gray-300 mt-2">
            Descubra o Vale do Café no Sul Fluminense e explore
            fazendas históricas, cafés coloniais e experiências culturais.
          </Text>

        </View>



        <View className="bg-amber-900/40 p-6 rounded-3xl mb-8">

          <Text className="text-white text-lg font-bold mb-2">
            Rota sugerida hoje
          </Text>

          <Text className="text-gray-200">
            Vassouras → Café colonial → Conservatória
          </Text>

        </View>



        <Text className="text-white text-lg font-semibold mb-3">
          Explorar
        </Text>

        <View className="flex-row flex-wrap justify-between mb-8">

          <TouchableOpacity
            onPress={() => navigation.navigate("Explorar")}
            className="bg-white/10 w-[48%] p-5 rounded-2xl mb-4"
          >
            <Ionicons name="leaf" size={28} color="#fbbf24" />
            <Text className="text-white mt-2 font-semibold">
              Fazendas históricas
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => navigation.navigate("Explorar")}
            className="bg-white/10 w-[48%] p-5 rounded-2xl mb-4"
          >
            <Ionicons name="cafe" size={28} color="#fbbf24" />
            <Text className="text-white mt-2 font-semibold">
              Cafés coloniais
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => navigation.navigate("Explorar")}
            className="bg-white/10 w-[48%] p-5 rounded-2xl mb-4"
          >
            <Ionicons name="business" size={28} color="#fbbf24" />
            <Text className="text-white mt-2 font-semibold">
              Cidades históricas
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => navigation.navigate("Eventos")}
            className="bg-white/10 w-[48%] p-5 rounded-2xl mb-4"
          >
            <Ionicons name="musical-notes" size={28} color="#fbbf24" />
            <Text className="text-white mt-2 font-semibold">
              Música e cultura
            </Text>
          </TouchableOpacity>

        </View>



        <Text className="text-white text-lg font-semibold mb-3">
          Lugares populares
        </Text>


        <View className="bg-white/10 p-5 rounded-2xl mb-4">

          <Text className="text-white font-semibold">
            Fazenda Santa Eufrásia
          </Text>

          <Text className="text-gray-300 mt-1">
            Uma das fazendas históricas mais tradicionais de Vassouras.
          </Text>

        </View>


        <View className="bg-white/10 p-5 rounded-2xl mb-8">

          <Text className="text-white font-semibold">
            Conservatória
          </Text>

          <Text className="text-gray-300 mt-1">
            Cidade famosa pelas serenatas e música ao vivo.
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>

  );
}