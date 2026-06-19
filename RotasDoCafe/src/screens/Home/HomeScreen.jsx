import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getRecentPlaces, subscribeRecentPlaces } from "../../services/recentPlaces";
import SuggestedRouteCard from "../../components/Card/SuggestedRouteCard";

export default function HomeScreen({ navigation }) {
  const [recentPlaces, setRecentPlaces] = useState([]);

  const loadRecentPlaces = useCallback(async () => {
    const places = await getRecentPlaces();
    setRecentPlaces(places.slice(0, 3));
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeRecentPlaces((places) => {
      setRecentPlaces(places.slice(0, 3));
    });

    loadRecentPlaces();

    return unsubscribe;
  }, [loadRecentPlaces]);

  useFocusEffect(
    useCallback(() => {
      loadRecentPlaces();
    }, [loadRecentPlaces])
  );

  const openPlaceOnMap = (place) => {
    navigation.navigate("Explorar", {
      selectedPlace: place,
      _tsPlace: Date.now(),
    });
  };

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

        <SuggestedRouteCard
          onPress={(route) =>
            navigation.navigate("Explorar", {
              selectedRoute: route,
              _ts: Date.now(),
            })
          }
        />

        <Text className="text-white text-lg font-semibold mb-3">
          Explorar
        </Text>

        <View className="flex-row flex-wrap justify-between mb-8">

          <TouchableOpacity
            onPress={() => navigation.navigate("Categoria", { category: "fazendas" })}
            className="bg-white/10 w-[48%] p-5 rounded-2xl mb-4"
          >
            <Ionicons name="leaf" size={28} color="#fbbf24" />
            <Text className="text-white mt-2 font-semibold">
              Fazendas históricas
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => navigation.navigate("Categoria", { category: "turismo_lazer" })}
            className="bg-white/10 w-[48%] p-5 rounded-2xl mb-4"
          >
            <Ionicons name="cafe" size={28} color="#fbbf24" />
            <Text className="text-white mt-2 font-semibold">
              Turismo & Lazer
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => navigation.navigate("Categoria", { category: "mirantes" })}
            className="bg-white/10 w-[48%] p-5 rounded-2xl mb-4"
          >
            <Ionicons name="binoculars" size={28} color="#fbbf24" />
            <Text className="text-white mt-2 font-semibold">
              Mirantes
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
          Últimos lugares abertos
        </Text>

        {recentPlaces.length === 0 ? (
          <View className="bg-white/10 p-5 rounded-2xl mb-8">
            <Text className="text-white font-semibold">
              Abra um lugar na tela Explorar
            </Text>

            <Text className="text-gray-300 mt-1">
              Os últimos lugares visualizados aparecem aqui automaticamente.
            </Text>
          </View>
        ) : (
          <View className="mb-8 gap-4">
            {recentPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                onPress={() => openPlaceOnMap(place)}
                className="bg-white/10 p-5 rounded-2xl active:opacity-80"
              >
                <View className="flex-row items-center">
                  <View className="w-11 h-11 rounded-xl bg-amber-400/20 items-center justify-center mr-3">
                    <Text className="text-2xl">
                      {place.icon || "📍"}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-white font-semibold">
                      {place.title}
                    </Text>

                    <Text className="text-gray-300 mt-1" numberOfLines={2}>
                      {place.locationLabel}
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#fbbf24" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>

    </SafeAreaView>

  );
}