import { useMemo, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import usePlaces from "../../hooks/MapScreen/usePlaces";
import useLocation from "../../hooks/MapScreen/useLocation";
import { saveRecentPlace } from "../../services/recentPlaces";
import {
  categories,
  buildCategorySummary,
  enrichPlace,
  filterPlacesByCategory,
  sortByDistance,
  sortByRecommendation,
} from "../../utils/places";

export default function ExploreScreen() {
  const route = useRoute()
  const navigation = useNavigation();
  const { places, loading } = usePlaces();
  const { location, status } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");

  useFocusEffect(
    useCallback(() => {
      if (route.params?.category) {
        setSelectedCategory(route.params.category);
      }
    }, [route.params?.category])
  );

  const enrichedPlaces = useMemo(() => {
    return places.map((place) => enrichPlace(place, location));
  }, [location, places]);

  const categorySummary = useMemo(() => {
    return buildCategorySummary(enrichedPlaces);
  }, [enrichedPlaces]);

  const filteredPlaces = useMemo(() => {
    return filterPlacesByCategory(enrichedPlaces, selectedCategory);
  }, [enrichedPlaces, selectedCategory]);

  const recommended = useMemo(() => {
    return sortByRecommendation(filteredPlaces).slice(0, 4);
  }, [filteredPlaces]);

  const nearby = useMemo(() => {
    return sortByDistance(
      filteredPlaces.filter((place) => place.distanceInKm !== null)
    );
  }, [filteredPlaces]);

  const featuredPlace = recommended[0] ?? enrichedPlaces[0] ?? null;

  const openPlaceOnMap = (place) => {
    saveRecentPlace(place);

    navigation.navigate('Mapa', {
      selectedPlace: place,
    });
  };

  const renderPlaceCard = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => openPlaceOnMap(item)}
      className="bg-white/10 rounded-2xl mb-3 flex-row items-center p-4 active:opacity-80"
    >

      <View className="w-12 h-12 rounded-xl bg-white/10 items-center justify-center mr-4">
        <Text className="text-xl">
          {item.icon}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-white font-semibold">
          {item.title}
        </Text>

        <Text className="text-white text-sm mt-1">
          {item.locationLabel}
        </Text>

        {item.distanceInKm !== null && (
          <Text className="text-white text-xs mt-1">
            {item.distanceInKm.toFixed(1)} km de você
          </Text>
        )}
      </View>

      <Text className="text-white">
        →
      </Text>

    </TouchableOpacity>
  )

  const showLoading = loading && !places.length;

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

        {featuredPlace && (
          <TouchableOpacity
            onPress={() => openPlaceOnMap(featuredPlace)}
            className="bg-amber-800 p-5 rounded-2xl mb-6 active:opacity-90"
          >
            <Text className="text-yellow-200 text-xs font-semibold mb-2">
              🔥 Destaque do mapa
            </Text>

            <Text className="text-white text-xl font-bold">
              {featuredPlace.title}
            </Text>

            <Text className="text-gray-200 mt-2">
              📍 {featuredPlace.locationLabel}
            </Text>

            <Text className="text-gray-300 mt-2 text-sm">
              Toque para abrir no mapa
            </Text>
          </TouchableOpacity>
        )}

        <Text className="text-white text-xl font-semibold mb-3">
          Categorias
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {[{ key: 'all', name: 'Todos', icon: '✨' }, ...categories].map((item) => {
            const summary = categorySummary.find((category) => category.key === item.key)
            const isSelected = selectedCategory === item.key
            const count = item.key === 'all' ? enrichedPlaces.length : summary?.count ?? 0

            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setSelectedCategory(item.key)}
                className={`px-5 py-4 rounded-2xl mr-3 items-center active:bg-white/20 ${isSelected ? 'bg-amber-400' : 'bg-white/10'}`}
              >
                <Text className="text-2xl mb-1">{item.icon}</Text>

                <Text className={`text-sm font-semibold ${isSelected ? 'text-black' : 'text-white'}`}>
                  {item.name}
                </Text>

                <Text className={`text-xs mt-1 ${isSelected ? 'text-black/80' : 'text-gray-400'}`}>
                  {count}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        <Text className="text-white text-xl font-semibold mb-3">
          Recomendados
        </Text>

        {showLoading && (
          <View className="py-6 items-center">
            <ActivityIndicator color="#fbbf24" />
            <Text className="text-gray-300 mt-3">
              Carregando lugares do mapa...
            </Text>
          </View>
        )}

        {!showLoading && recommended.length === 0 && (
          <Text className="text-gray-400 mb-4">
            Nenhum lugar encontrado para essa categoria.
          </Text>
        )}

        {!showLoading && recommended.map(renderPlaceCard)}

        <Text className="text-white text-xl font-semibold mt-6 mb-3">
          Próximos de você
        </Text>

        {status !== 'granted' && (
          <Text className="text-gray-400 mb-4">
            Ative a localização para ordenar os lugares por proximidade.
          </Text>
        )}

        {!showLoading && nearby.length === 0 && status === 'granted' && (
          <Text className="text-gray-400 mb-4">
            Não foi possível calcular lugares próximos agora.
          </Text>
        )}

        {!showLoading && nearby.map(renderPlaceCard)}

      </ScrollView>

    </SafeAreaView>
  );
}