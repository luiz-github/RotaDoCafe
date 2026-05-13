import { useMemo, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button/Button";
import useBiometricAuth from "../../hooks/AuthScreen/useBiometricAuth";
import useLogin from "../../hooks/AuthScreen/useLogin";
import useLoginForm from "../../hooks/AuthScreen/useLoginForm";
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from "../../components/Loading/Loading";
import { canSubmitLoginForm } from "../../services/validations/loginValidation";

import "../../styles/global.css";

export default function AuthScreen({ navigation, route }) {
  const initialEmail = route?.params?.email || "";
  const { email, password, setEmail, setPassword } = useLoginForm(initialEmail);

  useEffect(() => {
    const loadLastEmail = async () => {
      if (initialEmail) return
      try {
        const last = await AsyncStorage.getItem('lastEmail')
        if (!initialEmail && last) {
          setEmail(last)
        }
      } catch (e) {
        console.warn('Erro ao carregar lastEmail:', e)
      }
    }

    loadLastEmail()
  }, [initialEmail, setEmail])
  const { isBiometricAvailable, isBiometricEnabledForEmail, handleBiometricAuth } = useBiometricAuth(navigation, email);
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, loading, firstLogin } = useLogin(navigation, email);
  const isLoginFormValid = useMemo(
    () => canSubmitLoginForm({ email, password }),
    [email, password]
  );


  return (

    <SafeAreaView className="flex-1 bg-coffee">

      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
        className="flex-1"
      >

        <Loading
          visible={loading}
          text="Autenticando..."
        />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >

          <View className="flex-1 justify-center px-6 pt-10">

            <View className="items-center mb-10">

              <Text className="text-3xl font-bold text-white mb-2">
                Rota do Café
              </Text>

              <Text className="text-lg text-gray-300">
                Bem-vindo!
              </Text>

            </View>

            <View className="bg-white/10 p-6 rounded-xl">

              <Text className="text-white text-sm mb-2">
                E-mail
              </Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#ccc"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-white rounded-lg px-4 py-3 mb-4"
              />

              <Text className="text-white text-sm mb-2">
                Senha
              </Text>
              <View className="relative mb-6">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#ccc"
                  secureTextEntry={!showPassword}
                  className="bg-white rounded-lg px-4 py-3 pr-12"
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: [{ translateY: -10 }]
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={{ fontSize: 16 }}>
                    {showPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
                className="mb-4 items-end"
              >
                <Text className="text-gray-300 underline">
                  Esqueceu sua senha?
                </Text>
              </TouchableOpacity>

              <Button
                title="Entrar"
                disabled={loading || !isLoginFormValid}
                onPress={() => handleLogin(email, password)}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                className="mt-4 items-center"
              >
                <Text className="text-gray-300">
                  Não tem conta?{" "}
                  <Text className="text-white font-semibold">
                    Cadastre-se
                  </Text>
                </Text>
              </TouchableOpacity>

              {!firstLogin && isBiometricAvailable && isBiometricEnabledForEmail && (
                <>
                  <View className="flex-row items-center my-6">
                    <View className="flex-1 h-px bg-gray-400" />

                    <Text className="mx-3 text-gray-300">
                      ou
                    </Text>

                    <View className="flex-1 h-px bg-gray-400" />
                  </View>

                  <TouchableOpacity
                    onPress={() => handleBiometricAuth(email)}
                    className="bg-white/20 p-4 rounded-lg items-center"
                  >
                    <Text className="text-white font-semibold">
                      Entrar com Biometria
                    </Text>
                  </TouchableOpacity>
                </>
              )}

            </View>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );

}