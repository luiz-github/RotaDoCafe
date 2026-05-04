import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

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
  };

  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-coffee">

      <KeyboardAwareScrollView
        ref={scrollRef}
        enableOnAndroid
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 160
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

            <TextInput
              value={form[field]}
              keyboardType={field === "price" ? "numeric" : "default"}
              onFocus={(event) => {
                scrollRef.current?.scrollToFocusedInput(event.target);
              }}
              onChangeText={(v) => {
                if (field === "price") {
                  setForm({ ...form, [field]: v.replace(/[^0-9]/g, "") });
                } else {
                  setForm({ ...form, [field]: v });
                }
              }}
              className="bg-white/10 text-white p-3 rounded"
            />

          </View>
        ))}

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
                is_free: !form.price,
                price: form.price ? Number(form.price) : 0,
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