import { Alert } from "react-native";
export default function useLogout(navigation) {
    const handleLogout = (username, passowrd) => {

        if (!username || !passowrd) {
            Alert.alert("Erro", "Preencha todos os campos para continuar.");
            return;
        }

        navigation.replace("App");

    };
    return handleLogout;
}