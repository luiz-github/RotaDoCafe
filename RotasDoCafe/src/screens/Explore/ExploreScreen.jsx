import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { exploreData } from "../../mocks/explore";

export default function ExploreScreen() {

  const recommended = exploreData.items.slice(0, 8);
  const nearby = exploreData.items.slice(8, 20);

  const getIcon = (type) => {
    if (type === "cafe") return "☕";
    if (type === "fazenda") return "🏛️";
    if (type === "turismo") return "📍";
    return "📌";
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-coffee">

      <ScrollView
        className="px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >

        <Text className="text-white text-3xl font-bold mb-1">
          Explorar
        </Text>

        <Text className="text-gray-300 mb-6">
          Descubra experiências únicas ☕
        </Text>

        <TouchableOpacity className="bg-amber-800 p-5 rounded-2xl mb-6 active:opacity-90">
          <Text className="text-yellow-200 text-xs font-semibold mb-2">
            🔥 {exploreData.highlight.tag}
          </Text>

          <Text className="text-white text-xl font-bold">
            {exploreData.highlight.title}
          </Text>

          <Text className="text-gray-200 mt-2">
            📍 {exploreData.highlight.location}
          </Text>
        </TouchableOpacity>

        <Text className="text-white text-xl font-semibold mb-3">
          Categorias
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {exploreData.categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white/10 px-5 py-4 rounded-2xl mr-3 items-center active:bg-white/20"
            >
              <Text className="text-2xl mb-1">{item.icon}</Text>

              <Text className="text-white text-sm font-semibold">
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text className="text-white text-xl font-semibold mb-3">
          Recomendados
        </Text>

        {recommended.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="bg-white/10 rounded-2xl mb-3 flex-row items-center p-4 active:opacity-80"
          >

            <View className="w-12 h-12 rounded-xl bg-white/10 items-center justify-center mr-4">
              <Text className="text-xl">
                {getIcon(item.type)}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-white font-semibold">
                {item.title}
              </Text>

              <Text className="text-gray-400 text-sm mt-1">
                {item.location}
              </Text>
            </View>

            <Text className="text-gray-500">
              →
            </Text>

          </TouchableOpacity>
        ))}

        <Text className="text-white text-xl font-semibold mt-6 mb-3">
          Próximos de você
        </Text>

        {nearby.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="bg-white/10 rounded-2xl mb-3 flex-row items-center p-4 active:opacity-80"
          >

            <View className="w-12 h-12 rounded-xl bg-white/10 items-center justify-center mr-4">
              <Text className="text-xl">
                {getIcon(item.type)}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-white font-semibold">
                {item.title}
              </Text>

              <Text className="text-gray-400 text-sm mt-1">
                {item.location}
              </Text>
            </View>

            <Text className="text-gray-500">
              →
            </Text>

          </TouchableOpacity>
        ))}

      </ScrollView>

    </SafeAreaView>
  );
}