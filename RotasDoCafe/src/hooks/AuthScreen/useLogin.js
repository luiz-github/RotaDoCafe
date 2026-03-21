import { Alert } from "react-native";
export default function useLogin(navigation) {

    const MOCK_USER = {
        username: "admin",
        password: "123"
    }
    const handleLogin = (username, password) => {

        if (!username || !password) {
            Alert.alert("Erro", "Preencha todos os campos para continuar.");
            return;
        }

        if (
            username === MOCK_USER.username &&
            password === MOCK_USER.password
        ) {
            Alert.alert("Sucesso", `Bem-vindo, ${MOCK_USER.username}!`);
            navigation.replace("App");
            return;
        }

        Alert.alert("Erro", "Usuário ou senha inválidos.");
    };
    return handleLogin;
}