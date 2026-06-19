import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";

import DateTimePicker from "@react-native-community/datetimepicker";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState, useRef } from "react";
import { useEvents } from "../../hooks/EventScreen/useEvents";
import {
  validateEventForm,
  validateFutureEventDateTime,
  validateLocation,
} from "../../services/validations/eventValidation";
import useToast from "../../components/Toast/ToastMessage";
import { allowedCities } from "../../data/allowedCities";

export default function EditEventScreen({ route, navigation }) {
  const { event } = route.params;
  const { updateEvent } = useEvents();
  const scrollRef = useRef(null);
  const mapRef = useRef(null);
  const fullScreenMapRef = useRef(null);
  const debounceTimer = useRef(null);
  const lastWarnedCity = useRef(null);

  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({
    title: event.title,
    city: event.city || "",
    state: event.state || "",
    location: event.location,
    description: event.description,
    organizer: event.organizer,
    price: event.price?.toString() || "",
    age_rating: event.age_rating,
    eventDateTime:
      event.date?.toDate ? event.date.toDate() : event.date || null,
    schedule: event.schedule || "",
    latitude: event.latitude || -22.4038900,
    longitude: event.longitude || -43.6625000,
  });

  const visibleFields = [
    "title",
    "location",
    "description",
    "organizer",
    "price",
    "age_rating",
    "eventDateTime",
    "schedule",
  ];

  const labels = {
    title: "Título",
    location: "Local do evento",
    description: "Descrição",
    organizer: "Organizador",
    price: "Preço",
    age_rating: "Classificação Etária",
    eventDateTime: "Dia e hora do evento",
    schedule: "Programação do Evento",
  };

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(
    !!event.latitude && !!event.longitude
  );
  const [foundAddress, setFoundAddress] = useState(event.location || "");

  const [showFullScreenMap, setShowFullScreenMap] = useState(false);
  const [fullScreenCoords, setFullScreenCoords] = useState({
    latitude: form.latitude,
    longitude: form.longitude,
  });
  const [fullScreenAddress, setFullScreenAddress] = useState("");
  const [fullScreenCity, setFullScreenCity] = useState("");
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const isCityAllowed = (cityName) => {
    if (!cityName) return false;
    const normalizedCity = cityName.toLowerCase().trim();
    return allowedCities.some(
      (allowed) => allowed.toLowerCase().trim() === normalizedCity
    );
  };

  const extractCityFromFormattedAddress = (formattedAddress) => {
    if (!formattedAddress) return null;
    const match = formattedAddress.match(/,\s*([^,]+?)\s*-\s*[A-Z]{2}/);
    if (match && match[1]) {
      return match[1].trim();
    }
    return null;
  };

  const extractCityFromReverseGeocode = async (latitude, longitude) => {
    try {
      const reverseResults = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseResults.length === 0) {
        console.log("Nenhum resultado no reverse geocode");
        return null;
      }

      const r = reverseResults[0];
      // console.log("Reverse geocode completo:", r);

      let cityName = r.subregion || "";

      if (!cityName && r.formattedAddress) {
        cityName = extractCityFromFormattedAddress(r.formattedAddress) || "";
      }

      if (!cityName) {
        cityName = r.district || "";
      }

      const fullAddress = [
        r.name,
        r.street,
        r.streetNumber,
        r.district,
        cityName,
        r.region,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        city: cityName,
        state: r.region || "",
        fullAddress: fullAddress,
        raw: r,
      };
    } catch (error) {
      console.log("Erro ao extrair cidade:", error);
      return null;
    }
  };

  const searchLocation = async () => {
    const query = form.location.trim();

    if (!query) {
      showError("Digite o nome do local para buscar");
      return;
    }

    setIsSearching(true);
    setLocationConfirmed(false);
    setFoundAddress("");

    try {
      const results = await Location.geocodeAsync(query);

      if (results.length === 0) {
        showError("Local não encontrado. Tente outro nome.");
        setIsSearching(false);
        return;
      }

      const allowedResults = [];

      for (const result of results) {
        const locationInfo = await extractCityFromReverseGeocode(
          result.latitude,
          result.longitude
        );

        if (locationInfo && isCityAllowed(locationInfo.city)) {
          allowedResults.push({
            coords: result,
            city: locationInfo.city,
            state: locationInfo.state,
            fullAddress: locationInfo.fullAddress,
          });
        }
      }

      if (allowedResults.length === 0) {
        showError("Local fora das cidades do Vale do Café permitidas");
        setIsSearching(false);
        return;
      }

      const { coords, city, state, fullAddress } = allowedResults[0];
      const { latitude, longitude } = coords;

      setForm((prev) => ({ ...prev, latitude, longitude }));

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
        );
      }

      setForm((prev) => ({
        ...prev,
        location: fullAddress,
        city: city,
        state: state,
      }));

      setFoundAddress(fullAddress);
      setLocationConfirmed(true);
      showSuccess(`Local encontrado em ${city}! ✓`);
    } catch (error) {
      console.log("Erro ao buscar local:", error);
      showError("Erro ao buscar local. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const useCurrentLocation = async () => {
    try {
      setIsSearching(true);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showError("Permissão de localização negada");
        setIsSearching(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;

      const locationInfo = await extractCityFromReverseGeocode(
        latitude,
        longitude
      );

      if (locationInfo) {
        if (!isCityAllowed(locationInfo.city)) {
          showError(
            `Você está fora das cidades do Vale do Café (${locationInfo.city || "local desconhecido"
            })`
          );
          setIsSearching(false);
          return;
        }

        setForm((prev) => ({ ...prev, latitude, longitude }));

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            1000
          );
        }

        setForm((prev) => ({
          ...prev,
          location: locationInfo.fullAddress || "Minha localização",
          city: locationInfo.city,
          state: locationInfo.state,
        }));

        setFoundAddress(locationInfo.fullAddress || "Localização atual");
        setLocationConfirmed(true);
        showSuccess(`Localização atual em ${locationInfo.city} definida!`);
      } else {
        showError("Não foi possível identificar sua localização");
      }
    } catch (error) {
      console.log("Erro ao obter localização:", error);
      showError("Erro ao obter localização atual");
    } finally {
      setIsSearching(false);
    }
  };

  const openFullScreenMap = () => {
    setFullScreenCoords({
      latitude: form.latitude,
      longitude: form.longitude,
    });
    setFullScreenAddress(form.location || "");
    setFullScreenCity(form.city || "");
    lastWarnedCity.current = null;
    setShowFullScreenMap(true);
  };

  const confirmFullScreenSelection = async () => {
    try {
      setIsReverseGeocoding(true);

      const locationInfo = await extractCityFromReverseGeocode(
        fullScreenCoords.latitude,
        fullScreenCoords.longitude
      );

      if (locationInfo) {
        if (!isCityAllowed(locationInfo.city)) {
          showError(
            `Local fora das cidades do Vale do Café (${locationInfo.city || "desconhecido"
            })`
          );
          setIsReverseGeocoding(false);
          return;
        }

        setForm((prev) => ({
          ...prev,
          latitude: fullScreenCoords.latitude,
          longitude: fullScreenCoords.longitude,
          location: locationInfo.fullAddress || "Local selecionado",
          city: locationInfo.city,
          state: locationInfo.state,
        }));

        setFoundAddress(locationInfo.fullAddress);
        setLocationConfirmed(true);

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: fullScreenCoords.latitude,
              longitude: fullScreenCoords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            500
          );
        }

        showSuccess(`Local em ${locationInfo.city} selecionado! ✓`);
      } else {
        showError("Não foi possível identificar o local");
      }

      setShowFullScreenMap(false);
    } catch (error) {
      console.log("Erro ao confirmar localização:", error);
      showError("Erro ao confirmar localização");
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const onFullScreenMapRegionChangeComplete = (region) => {
    const newCoords = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    setFullScreenCoords(newCoords);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        setIsReverseGeocoding(true);
        const locationInfo = await extractCityFromReverseGeocode(
          newCoords.latitude,
          newCoords.longitude
        );

        if (locationInfo) {
          setFullScreenAddress(locationInfo.fullAddress || "Local selecionado");
          setFullScreenCity(locationInfo.city || "");

          if (!isCityAllowed(locationInfo.city)) {
            const cityName = locationInfo.city || "desconhecida";

            if (lastWarnedCity.current !== cityName) {
              showError(
                `⚠️ Local em "${cityName}" não está nas cidades do Vale do Café`
              );
              lastWarnedCity.current = cityName;
            }
          } else {
            lastWarnedCity.current = null;
          }
        }
      } catch (e) {
        console.log("Erro no reverse geocode do mapa cheio:", e);
      } finally {
        setIsReverseGeocoding(false);
      }
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-coffee">
      <KeyboardAwareScrollView
        ref={scrollRef}
        enableOnAndroid
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 160,
        }}
      >
        <Text className="text-white text-2xl font-bold mb-6">
          Editar Evento
        </Text>

        {visibleFields.map((field) => (
          <View key={field} className="mb-4">
            <Text className="text-gray-300 mb-1">{labels[field]}</Text>

            {field === "eventDateTime" ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowDatePicker(true)}
                className="bg-white/10 border border-white/10 p-4 rounded-xl flex-row items-center justify-between"
              >
                <Text className="text-white">
                  {form.eventDateTime
                    ? form.eventDateTime.toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                    : "Selecionar data e hora"}
                </Text>
                <Text className="text-gray-400 text-lg">📅</Text>
              </TouchableOpacity>
            ) : field === "location" ? (
              <View>
                <TextInput
                  value={form.location}
                  placeholder="Ex: Universidade de Vassouras..."
                  placeholderTextColor="#94a3b8"
                  onChangeText={(v) => {
                    setForm({ ...form, location: v });
                    setLocationConfirmed(false);
                  }}
                  onSubmitEditing={searchLocation}
                  returnKeyType="search"
                  className="bg-white/10 text-white p-3 rounded-t-xl border border-white/10"
                />

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={searchLocation}
                    disabled={isSearching}
                    className="flex-1 bg-amber-400 p-3 rounded-b-xl flex-row items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <ActivityIndicator size="small" color="#000" />
                    ) : (
                      <>
                        <Text>🔍</Text>
                        <Text className="text-black font-semibold">
                          Buscar local
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={useCurrentLocation}
                    disabled={isSearching}
                    className="bg-blue-500 px-4 rounded-b-xl flex-row items-center justify-center"
                  >
                    <Text className="text-white text-lg">📍</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={openFullScreenMap}
                  className="mt-2 bg-purple-600 p-3 rounded-xl flex-row items-center justify-center gap-2"
                >
                  <Text className="text-white text-lg">🗺️</Text>
                  <Text className="text-white font-semibold">
                    Selecionar no mapa
                  </Text>
                </TouchableOpacity>

                <View
                  className="mt-3 rounded-xl overflow-hidden border border-white/20"
                  style={{ height: 280 }}
                >
                  <MapView
                    ref={mapRef}
                    style={{ flex: 1 }}
                    provider={PROVIDER_DEFAULT}
                    initialRegion={{
                      latitude: form.latitude,
                      longitude: form.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    {form.latitude && form.longitude && (
                      <Marker
                        coordinate={{
                          latitude: form.latitude,
                          longitude: form.longitude,
                        }}
                        title={form.title || form.location || "Local do Evento"}
                      />
                    )}
                  </MapView>
                </View>

                <View className="mt-2 p-3 rounded-lg bg-white/5">
                  {locationConfirmed ? (
                    <View>
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-green-400">✓</Text>
                        <Text className="text-green-400 text-sm font-semibold">
                          Local confirmado {form.city ? `(${form.city})` : ""}
                        </Text>
                      </View>
                      {foundAddress ? (
                        <Text className="text-gray-300 text-xs">
                          📍 {foundAddress}
                        </Text>
                      ) : null}
                    </View>
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <Text className="text-yellow-400">⚠</Text>
                      <Text className="text-yellow-400 text-sm">
                        Digite o nome do local e clique em "Buscar"
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <TextInput
                value={form[field]}
                placeholder={
                  field === "price"
                    ? "0.00"
                    : field === "schedule"
                      ? "Ex:\n18h - Abertura\n19h - Show principal\n22h - Encerramento"
                      : labels[field]
                }
                placeholderTextColor="#94a3b8"
                keyboardType={field === "price" ? "numeric" : "default"}
                multiline={field === "schedule"}
                numberOfLines={field === "schedule" ? 8 : 1}
                textAlignVertical={field === "schedule" ? "top" : "center"}
                maxLength={field === "schedule" ? 1000 : undefined}
                onFocus={(event) => {
                  scrollRef.current?.scrollToFocusedInput(event.target);
                }}
                onChangeText={(v) => {
                  if (field === "price") {
                    const cleaned = v.replace(/[^0-9.,]/g, "");
                    setForm({ ...form, [field]: cleaned });
                  } else {
                    setForm({ ...form, [field]: v });
                  }
                }}
                className={`bg-white/10 text-white p-3 rounded ${field === "schedule" ? "min-h-[180px]" : ""
                  }`}
              />
            )}
          </View>
        ))}

        {showDatePicker && (
          <DateTimePicker
            value={form.eventDateTime || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selected) => {
              setShowDatePicker(false);

              if (selected) {
                const current = form.eventDateTime || new Date();
                const merged = new Date(selected);

                merged.setHours(
                  current.getHours(),
                  current.getMinutes(),
                  0,
                  0
                );

                setForm({ ...form, eventDateTime: merged });
                setShowTimePicker(true);
              }
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={form.eventDateTime || new Date()}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selected) => {
              setShowTimePicker(false);

              if (selected) {
                const current = form.eventDateTime || new Date();
                const merged = new Date(current);

                merged.setHours(
                  selected.getHours(),
                  selected.getMinutes(),
                  0,
                  0
                );

                setForm({ ...form, eventDateTime: merged });
              }
            }}
          />
        )}

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-1 bg-gray-600 p-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={loading}
            onPress={async () => {
              const dateValidation = validateFutureEventDateTime(
                form.eventDateTime
              );
              if (!dateValidation.isValid) {
                showError(dateValidation.error);
                return;
              }

              const result = validateEventForm(form);
              if (!result.isValid) {
                showError(Object.values(result.errors)[0]);
                return;
              }

              const locationValidation = validateLocation(form);
              if (!locationValidation.isValid) {
                showError(locationValidation.error);
                return;
              }

              setLoading(true);

              const success = await updateEvent(event.id, {
                ...form,
                is_free:
                  Number((form.price || "0").replace(",", ".")) === 0,
                price:
                  Number((form.price || "0").replace(",", ".")).toFixed(2) *
                  1,
                date: form.eventDateTime || event.date,
                latitude: form.latitude,
                longitude: form.longitude,
              });

              setLoading(false);

              if (success) navigation.goBack();
            }}
            className="flex-1 bg-blue-500 p-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              {loading ? "Atualizando..." : "Atualizar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <Modal
        visible={showFullScreenMap}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowFullScreenMap(false)}
      >
        <SafeAreaView className="flex-1 bg-black">
          <View className="bg-gray-900 px-4 py-3 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => setShowFullScreenMap(false)}
              className="p-2"
            >
              <Text className="text-white text-lg">✕ Cancelar</Text>
            </TouchableOpacity>
            <Text className="text-white font-bold text-lg">Selecionar Local</Text>
            <TouchableOpacity
              onPress={confirmFullScreenSelection}
              disabled={isReverseGeocoding}
              className="p-2"
            >
              {isReverseGeocoding ? (
                <ActivityIndicator size="small" color="#fbbf24" />
              ) : (
                <Text className="text-amber-400 font-bold text-lg">
                  Confirmar
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="bg-gray-800 px-4 py-2">
            <Text className="text-gray-400 text-xs text-center">
              📍 Cidades do Vale do Café
            </Text>
          </View>

          <View className="flex-1">
            <MapView
              ref={fullScreenMapRef}
              style={{ flex: 1 }}
              provider={PROVIDER_DEFAULT}
              initialRegion={{
                latitude: fullScreenCoords.latitude,
                longitude: fullScreenCoords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onRegionChangeComplete={onFullScreenMapRegionChangeComplete}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              <Marker
                coordinate={fullScreenCoords}
                title="Local selecionado"
                pinColor="#fbbf24"
              />
            </MapView>

            <View
              pointerEvents="none"
              className="absolute top-1/2 left-1/2"
              style={{ transform: [{ translateX: -20 }, { translateY: -40 }] }}
            >
              <Text style={{ fontSize: 40 }}>📍</Text>
            </View>

            {fullScreenCity && !isCityAllowed(fullScreenCity) && (
              <View className="absolute top-4 left-4 right-4 bg-red-600/95 px-4 py-3 rounded-xl flex-row items-center gap-2">
                <Text className="text-white text-xl">⚠️</Text>
                <Text className="text-white text-sm font-semibold flex-1">
                  Local em "{fullScreenCity}" não está nas cidades do Vale do Café
                </Text>
              </View>
            )}

            {fullScreenCity && isCityAllowed(fullScreenCity) && (
              <View className="absolute top-4 left-4 right-4 bg-green-600/95 px-4 py-3 rounded-xl flex-row items-center gap-2">
                <Text className="text-white text-xl">✓</Text>
                <Text className="text-white text-sm font-semibold flex-1">
                  Local em "{fullScreenCity}" está dentro das cidades permitidas
                </Text>
              </View>
            )}
          </View>

          <View className="bg-gray-900 px-4 py-4 border-t border-gray-700">
            {fullScreenAddress ? (
              <>
                <Text className="text-white text-sm mb-1" numberOfLines={2}>
                  📍 {fullScreenAddress}
                </Text>
                {fullScreenCity && (
                  <Text
                    className={`text-xs mb-1 ${isCityAllowed(fullScreenCity)
                      ? "text-green-400"
                      : "text-red-400"
                      }`}
                  >
                    {isCityAllowed(fullScreenCity) ? "✓" : "✕"} Cidade:{" "}
                    {fullScreenCity}
                  </Text>
                )}
              </>
            ) : (
              <Text className="text-gray-400 text-sm mb-2">
                Mova o mapa para selecionar o local
              </Text>
            )}
            <Text className="text-gray-500 text-xs">
              Lat: {fullScreenCoords.latitude.toFixed(5)}, Lng:{" "}
              {fullScreenCoords.longitude.toFixed(5)}
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}