import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading/Loading";
import useForgotPassword from "../../hooks/AuthScreen/useForgotPassword";
import { canSubmitEmailOnlyForm } from "../../services/validations/loginValidation";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const { handleForgotPassword, loading } = useForgotPassword(navigation);
  const isEmailValid = canSubmitEmailOnlyForm(email);

  return (
    <SafeAreaView className="flex-1 bg-coffee">
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Loading visible={loading} text="Enviando e-mail..." />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center px-6">

            <View className="items-center mb-10">
              <Text className="text-3xl font-bold text-white">
                Recuperar senha
              </Text>

              <Text className="text-gray-300 mt-2 text-center">
                Digite seu e-mail e enviaremos um link para redefinir sua senha
              </Text>
            </View>

            <View className="bg-white/10 p-6 rounded-xl">

              <Text className="text-white mb-2">E-mail</Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#ccc"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-white rounded-lg px-4 py-3 mb-6"
              />

              <Button
                title="Enviar link de recuperação"
                onPress={() => handleForgotPassword(email)}
                disabled={loading || !isEmailValid}
              />

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="mt-4 items-center"
              >
                <Text className="text-gray-300">
                  Voltar para login
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}