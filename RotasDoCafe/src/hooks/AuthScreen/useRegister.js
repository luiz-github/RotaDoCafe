import { useState } from "react";
import Toast from "react-native-toast-message";

export default function useRegister(navigation) {
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validate = ({ username, email, password, confirmPassword }) => {
    if (!username || !email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Preencha todos os campos.",
      });
      return false;
    }

    if (!isValidEmail(email)) {
      Toast.show({
        type: "error",
        text1: "E-mail inválido",
        text2: "Digite um e-mail válido.",
      });
      return false;
    }


    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "As senhas não coincidem.",
      });
      return false;
    }

    return true;
  };

  const handleRegister = async ({ username, email, password, confirmPassword }) => {
    if (!validate({ username, email, password, confirmPassword })) return;

    try {
      setLoading(true);

      console.log("Registrando usuário:", { username, email });

      // implementar API AQ
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Toast.show({
        type: "success",
        text1: "Conta criada 🎉",
      });

      navigation.navigate("Auth");

    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Falha ao registrar usuário.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleRegister
  };
}