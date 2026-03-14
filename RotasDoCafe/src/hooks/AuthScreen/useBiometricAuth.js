import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export default function useBiometricAuth(navigation) {

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
                navigation.replace("App");
            } else {
                Alert.alert("Erro", "Autenticação falhou. Tente novamente.");
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro durante a autenticação.");
        }
    
    };

    return {
        isBiometricAvailable,
        handleBiometricAuth
    }


}