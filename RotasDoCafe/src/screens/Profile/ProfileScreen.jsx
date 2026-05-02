import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button/Button";
import useLogout from "../../hooks/AuthScreen/useLogout";
import ProfileAvatar from "../../components/Profile/ProfileAvatar";
import useChangePassword from "../../hooks/ProfileScreen/useChangePassword";

export default function ProfileScreen({ navigation }) {

  const handleLogout = useLogout(navigation);
  const { handleSave, loading } = useChangePassword();
  const [isEditing, setIsEditing] = useState(false);

  // implementar API AQ
  const [name, setName] = useState("teste");
  const [email, setEmail] = useState("teste@email.com");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveProfile = async () => {
    await handleSave({
      name,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
      onSuccess: () => {
        setIsEditing(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-coffee">

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
        className="flex-1"
      >

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 180
          }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
          showsVerticalScrollIndicator={false}
        >

          <View className="pt-10 pb-6 items-center">
            <Text className="text-3xl font-bold text-white">
              Perfil
            </Text>

            <Text className="text-gray-300 mt-2">
              Gerencie sua conta
            </Text>
          </View>

          <View className="bg-white/10 p-6 rounded-2xl">

            <View className="items-center mb-8">
              <ProfileAvatar />
            </View>

            <Text className="text-gray-400 mb-1">Nome</Text>
            {isEditing ? (
              <TextInput
                value={name}
                onChangeText={setName}
                className="bg-white rounded-xl px-4 py-3 mb-4"
              />
            ) : (
              <Text className="text-white mb-6 text-lg">
                {name}
              </Text>
            )}

            <Text className="text-gray-400 mb-1">E-mail</Text>
            {isEditing ? (
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-white rounded-xl px-4 py-3 mb-6"
              />
            ) : (
              <Text className="text-white mb-6 text-lg">
                {email}
              </Text>
            )}

            {isEditing && (
              <>
                <Text className="text-gray-400 mb-1">Senha atual</Text>
                <View className="relative mb-4">
                  <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrent}
                    className="bg-white rounded-xl px-4 py-3 pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrent(!showCurrent)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: [{ translateY: -10 }] }}
                  >
                    <Text>{showCurrent ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-400 mb-1">Nova senha</Text>
                <View className="relative mb-4">
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNew}
                    className="bg-white rounded-xl px-4 py-3 pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNew(!showNew)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: [{ translateY: -10 }] }}
                  >
                    <Text>{showNew ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-400 mb-1">Confirmar nova senha</Text>
                <View className="relative mb-6">
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirm}
                    className="bg-white rounded-xl px-4 py-3 pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: [{ translateY: -10 }] }}
                  >
                    <Text>{showConfirm ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {isEditing ? (
              <View className="flex-row gap-3 mt-2">
                <View className="flex-1">
                  <Button
                    title="Cancelar"
                    onPress={() => {
                      setIsEditing(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  />
                </View>

                <View className="flex-1">
                  <Button
                    title="Salvar"
                    onPress={handleSaveProfile}
                    disabled={loading}
                  />
                </View>
              </View>
            ) : (
              <Button
                title="Editar dados"
                onPress={() => setIsEditing(true)}
              />
            )}

            <View className="mt-6">
              <Button
                title="Sair da conta"
                onPress={handleLogout}
                variant="danger"
              />
            </View>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}