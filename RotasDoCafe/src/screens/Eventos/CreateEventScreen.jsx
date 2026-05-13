import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";


import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useEvents } from "../../hooks/EventScreen/useEvents";
import { validateEventForm } from "../../services/validations/eventValidation";
import Toast from "react-native-toast-message";

export default function CreateEventScreen({ navigation }) {
  const { createEvent } = useEvents();
  const scrollRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    city: "",
    state: "",
    location: "",
    description: "",
    organizer: "",
    price: "",
    age_rating: "Livre",
    eventDateTime: null,
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
          paddingBottom: 160
        }}
      >

        <Text className="text-white text-2xl font-bold mb-6">
          Criar Evento
        </Text>

        {Object.keys(form).map((field) => (
          <View key={field} className="mb-4">

            <Text className="text-gray-300 mb-1">
              {labels[field]}
            </Text>

            {field === "eventDateTime" ? (
              <View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setShowDatePicker(true)}
                  className="mb-2"
                >
                  <Text className="bg-white/10 text-white p-3 rounded">
                    {form.eventDateTime
                      ? `Dia: ${form.eventDateTime.toLocaleDateString("pt-BR")}`
                      : "Selecione o dia"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text className="bg-white/10 text-white p-3 rounded">
                    {form.eventDateTime
                      ? `Hora: ${form.eventDateTime.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                      : "Selecione a hora"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (



              <TextInput
                value={form[field]}
                keyboardType={field === "price" ? "numeric" : "default"}
                onFocus={(event) => {
                  scrollRef.current?.scrollToFocusedInput(event.target);
                }}
                onChangeText={(v) => {
                  if (field === "price") {
                    // Aceita vírgula e ponto (ex: 12,50 ou 12.50)
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
                merged.setHours(current.getHours(), current.getMinutes(), 0, 0);
                setForm({ ...form, eventDateTime: merged });
              }
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={form.eventDateTime || new Date()}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selected) => {
              setShowTimePicker(false);
              if (selected) {
                const current = form.eventDateTime || new Date();
                const merged = new Date(current);
                merged.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
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

              const success = await createEvent({
                ...form,
                is_free: Number((form.price || "0").replace(",", ".")) === 0,
                price: Number((form.price || "0").replace(",", ".")).toFixed(2) * 1,
                date: form.eventDateTime || new Date(),



              });


              setLoading(false);

              if (success) navigation.goBack();
            }}
            className="flex-1 bg-amber-400 p-4 rounded-xl"
          >
            <Text className="text-black text-center font-semibold">
              {loading ? "Salvando..." : "Salvar"}
            </Text>
          </TouchableOpacity>

        </View>

      </KeyboardAwareScrollView>

    </SafeAreaView>
  );
}