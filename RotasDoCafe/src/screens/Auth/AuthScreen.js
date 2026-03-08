import { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import Button from "../../components/Button/Button";
import "../../styles/global.css";

export default function AuthScreen({ navigation }) {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    setIsBiometricAvailable(compatible && enrolled);
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentique para acessar o app",
        cancelLabel: "Cancelar",
        disableDeviceFallback: false,
      });

      if (result.success) {
        navigation.replace("Home");
      } else {
        Alert.alert("Erro", "Autenticação falhou. Tente novamente.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro durante a autenticação.");
    }
  };

  return (
    <View className="flex-1 bg-coffee items-center justify-center p-5">

      <Text className="text-3xl font-bold text-white mb-2">
        Rotas do Café
      </Text>

      <Text className="text-lg text-gray-300 mb-10">
        Bem-vindo!
      </Text>

      {isBiometricAvailable ? (
        <Button
          title="Entrar com Biometria"
          onPress={handleBiometricAuth}
        />
      ) : (
        <Text className="text-red-400 text-base text-center mt-5">
          Dispositivo não compatível com biometria
        </Text>
      )}
    </View>
  );
}