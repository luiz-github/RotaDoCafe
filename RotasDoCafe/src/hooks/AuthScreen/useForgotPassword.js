import { useState } from "react";
import Toast from "react-native-toast-message";

export default function useForgotPassword(navigation) {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (email) => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Campo obrigatório",
        text2: "Digite seu e-mail",
      });
      return;
    }

    try {
      setLoading(true);

      // implementar API AQ
      console.log("Recuperação de senha:", email);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      Toast.show({
        type: "success",
        text1: "E-mail enviado 📩",
        text2: "Verifique sua caixa de entrada",
      });

      navigation.goBack();

    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: "Erro ao enviar e-mail",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleForgotPassword,
    loading,
  };
}