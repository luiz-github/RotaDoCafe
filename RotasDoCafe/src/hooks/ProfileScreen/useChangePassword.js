import { useState } from "react";
import Toast from "react-native-toast-message";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { auth } from "../../services/firebase";
import { saveBiometricSecret } from "../../services/biometric/biometricStorage";

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
    onSuccess,
  }) => {
    try {
      setLoading(true);

      const validation = validate({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (validation === null) return;

      if (validation) {
        const user = auth.currentUser;

        if (!user || !user.email) {
          throw new Error("Usuário não autenticado.");
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );

        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        await saveBiometricSecret(user.email, newPassword);
        Toast.show({
          type: "success",
          text1: "Senha alterada com sucesso",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Dados atualizados",
        });
      }

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