import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import useToast from "../../components/Toast/ToastMessage";

export default function useBiometricAuth(navigation) {
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
    const { showSuccess, showError } = useToast()

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
                showSuccess("Autenticação bem-sucedida.");
            } else {
                showError("Autenticação falhou. Tente novamente.");
            }
        } catch (error) {
            showError("Ocorreu um erro durante a autenticação.");
        }
    
    };

    return {
        isBiometricAvailable,
        handleBiometricAuth
    }


}