import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState, useRef } from "react";
import { useEvents } from "../../hooks/EventScreen/useEvents";
import { validateEventForm } from "../../services/validations/eventValidation";
import Toast from "react-native-toast-message";

export default function EditEventScreen({ route, navigation }) {
  const { event } = route.params;
  const { updateEvent } = useEvents();
  const scrollRef = useRef(null);

  const [form, setForm] = useState({
    title: event.title,
    city: event.city,
    state: event.state,
    location: event.location,
    description: event.description,
    organizer: event.organizer,
    price: event.price?.toString() || "",
    age_rating: event.age_rating,
    eventDateTime:
      event.date?.toDate ? event.date.toDate() : event.date || null,
  });

  const labels = {
    title: "Título",
    city: "Cidade",
    state: "Estado",
    location: "Local",
    description: "Descrição",
    organizer: "Organizador",
    price: "Preço",
    age_rating: "Classificação Etária",
    eventDateTime: "Dia e hora do evento",
  };

  const [loading, setLoading] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

        {Object.keys(form).map((field) => (
          <View key={field} className="mb-4">

            <Text className="text-gray-300 mb-1">
              {labels[field]}
            </Text>

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
            ) : (
              <TextInput
                value={form[field]}
                placeholder={field === "price" ? "0.00" : labels[field]}
                placeholderTextColor="#94a3b8"
                keyboardType={field === "price" ? "numeric" : "default"}
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
                className="bg-white/10 text-white p-3 rounded"
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
              const result = validateEventForm(form);

              if (!result.isValid) {
                Toast.show({
                  type: "error",
                  text1: Object.values(result.errors)[0],
                });
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

    </SafeAreaView>
  );
}