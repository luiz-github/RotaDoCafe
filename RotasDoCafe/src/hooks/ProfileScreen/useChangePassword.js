import { useState } from "react";
import Toast from "react-native-toast-message";

export default function useChangePassword() {
  const [loading, setLoading] = useState(false);

  const validate = ({ currentPassword, newPassword, confirmPassword }) => {
    if (!currentPassword && !newPassword && !confirmPassword) {
      return false;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Preencha todos os campos da senha.",
      });
      return null;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "As senhas não coincidem.",
      });
      return null;
    }

    return true;
  };

  const handleSave = async ({
    currentPassword,
    newPassword,
    confirmPassword,
    name,
    email,
    onSuccess,
  }) => {
    try {
      setLoading(true);

      console.log("Salvando perfil:", { name, email });

      const validation = validate({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (validation === null) return;

      if (validation) {
        console.log("Alterando senha...", {
          currentPassword,
          newPassword,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        Toast.show({
          type: "success",
          text1: "Senha alterada com sucesso",
        });
      }

      Toast.show({
        type: "success",
        text1: "Dados atualizados",
      });

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Falha ao salvar dados.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSave,
  };
}