import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button/Button";
import useBiometricAuth from "../../hooks/AuthScreen/useBiometricAuth";
import useLogin from "../../hooks/AuthScreen/useLogin";
import useLoginForm from "../../hooks/AuthScreen/useLoginForm";
import Loading from "../../components/Loading/Loading";

import "../../styles/global.css";

export default function AuthScreen({ navigation }) {
  const { username, password, setUsername, setPassword } = useLoginForm();
  const { isBiometricAvailable, handleBiometricAuth } = useBiometricAuth(navigation);
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, loading } = useLogin(navigation);


  return (

    <SafeAreaView className="flex-1 bg-coffee">

      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >

       <Loading
          visible={loading}
          text="Autenticando..."
        />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

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
                Usuário
              </Text>

              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Digite seu usuário"
                placeholderTextColor="#ccc"
                className="bg-white rounded-lg px-4 py-3 mb-4"
              />

              <Text className="text-white text-sm mb-2">
                Senha
              </Text>
              <View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#ccc"
                  secureTextEntry={!showPassword}
                  className="bg-white rounded-lg px-4 py-3 mb-6"
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3"
                >
                  <Text className="text-gray-500">
                    {showPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>


              <Button
                title="Entrar"
                disabled={loading}
                onPress={() => handleLogin(username, password)}
              />

              <View className="flex-row items-center my-6">

                <View className="flex-1 h-px bg-gray-400" />

                <Text className="mx-3 text-gray-300">
                  ou
                </Text>

                <View className="flex-1 h-px bg-gray-400" />

              </View>

              {isBiometricAvailable && (

                <TouchableOpacity
                  onPress={handleBiometricAuth}
                  className="bg-white/20 p-4 rounded-lg items-center"
                >

                  <Text className="text-white font-semibold">
                    Entrar com Biometria
                  </Text>

                </TouchableOpacity>

              )}

            </View>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );

}