import { Alert } from "react-native";

export default function useLogout(navigation) {

    const handleLogout = () => {
        Alert.alert("Sair", "Deseja realmente sair do aplicativo?", [
            {
                text: "Cancelar",
                style: "cancel",
            },
            {
                text: "Sair",
                style: "destructive",
                onPress: () => navigation.replace("Auth"),
            },
        ]);
    }
    return handleLogout;
}