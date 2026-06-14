import { useState, useEffect } from "react";
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
import useUserProfile from "../../hooks/ProfileScreen/useUserProfile";

export default function ProfileScreen({ navigation }) {

  const handleLogout = useLogout(navigation);
  const { handleSave, loading } = useChangePassword();

  const { user, updateProfile, updating, updateProfilePhoto } = useUserProfile();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null)

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setImage(user.photoURL || null)
    }
  }, [user]);

  const handleSaveProfile = async () => {
    const success = await updateProfile({ name, email });

    if (!success) {
      return;
    }

    await handleSave({
      currentPassword,
      newPassword,
      confirmPassword,
      onSuccess: () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      },
    });

    setIsEditing(false);
  };

  const onChangePhoto = async (base64Image) => {
    await updateProfilePhoto(base64Image)
  }

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
              <ProfileAvatar
                image={image}
                onChangePhoto={onChangePhoto}
              />
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
            <TextInput
              value={email}
              editable={false}
              selectTextOnFocus={false}
              autoCapitalize="none"
              keyboardType="email-address"
              className={`
                rounded-xl mb-4
                ${isEditing
                  ? 'bg-neutral-200 text-neutral-500 px-4'
                  : 'bg-transparent text-white'
                }
              `}
            />
            {/* {isEditing ? (
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
            )} */}

            {isEditing && (
              <>
                <Text className="text-gray-400 mb-1">Senha atual</Text>
                <View style={{ position: "relative", marginBottom: 16 }}>
                  <TextInput
                    testID="current-password-input"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrent}
                    className="bg-white rounded-xl px-4 py-3 pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrent(!showCurrent)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 12,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>
                      {showCurrent ? "🙈" : "👁️"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-400 mb-1">Nova senha</Text>
                <View style={{ position: "relative", marginBottom: 16 }}>
                  <TextInput
                    testID="new-password-input"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNew}
                    className="bg-white rounded-xl px-4 py-3 pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNew(!showNew)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 12,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>
                      {showNew ? "🙈" : "👁️"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-400 mb-1">Confirmar nova senha</Text>
                <View style={{ position: "relative", marginBottom: 24 }}>
                  <TextInput
                    testID="confirm-password-input"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirm}
                    className="bg-white rounded-xl px-4 py-3 pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 12,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>
                      {showConfirm ? "🙈" : "👁️"}
                    </Text>
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
                      setName(user?.name || "");
                      setEmail(user?.email || "");
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setIsEditing(false);
                    }}
                  />
                </View>

                <View className="flex-1">
                  <Button
                    title={updating ? "Salvando..." : "Salvar"}
                    testID="save-profile-button"
                    onPress={handleSaveProfile}
                    disabled={updating}
                  />
                </View>

              </View>
            ) : (
              <Button
                title="Editar dados"
                testID="edit-profile-button"
                onPress={() => setIsEditing(true)}
              />
            )}

            <View className="mt-6">
              <Button
                title="Sair da conta"
                testID="logout-button"
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