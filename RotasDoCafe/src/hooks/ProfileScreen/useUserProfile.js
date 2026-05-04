import { useEffect, useState } from "react";
import { auth, db } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import Toast from "react-native-toast-message";

export default function useUserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setUser(null);
        return;
      }

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setUser({
          uid: currentUser.uid,
          name: data.username || "",
          email: data.email || currentUser.email || "",
        });
      } else {
        setUser({
          uid: currentUser.uid,
          name: "",
          email: currentUser.email || "",
        });
      }

    } catch (error) {
      console.error("Erro ao buscar usuário:", error);

      Toast.show({
        type: "error",
        text1: "Erro ao carregar perfil",
      });

    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async ({ name, email }) => {
    try {
      setUpdating(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }

      const userRef = doc(db, "users", currentUser.uid);

      await updateDoc(userRef, {
        username: name,
        email,
      });

      if (email && email !== currentUser.email) {
        try {
          await updateEmail(currentUser, email);
        } catch (err) {
          console.warn("Erro ao atualizar email no Auth:", err);

          Toast.show({
            type: "info",
            text1: "Email salvo, mas precisa relogar",
          });
        }
      }

      setUser((prev) => ({
        ...(prev || {}),
        name,
        email,
      }));

      Toast.show({
        type: "success",
        text1: "Perfil atualizado!",
      });

      return true;

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);

      Toast.show({
        type: "error",
        text1: "Erro ao atualizar perfil",
      });

      return false;

    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    updating,
    refetch: fetchUser,
    updateProfile,
  };
}