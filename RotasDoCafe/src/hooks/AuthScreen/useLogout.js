import { Alert } from "react-native";
import useToast from "../../components/Toast/ToastMessage";

export default function useLogout(navigation) {
    const { showSuccess } = useToast();
    
    const handleLogout = () => {
        Alert.alert("Sair", "Deseja realmente sair do aplicativo?", [
            {
                text: "Cancelar",
                style: "cancel",
            },
            {
                text: "Sair",
                style: "destructive",
                onPress: () => {
                    navigation.replace("Auth"),
                    showSuccess("Logout bem-sucedido.");
                },
            },
        ]);
    }
    return handleLogout;
}