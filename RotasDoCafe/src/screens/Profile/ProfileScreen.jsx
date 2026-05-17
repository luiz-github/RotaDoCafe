import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button/Button";
import useLogout from "../../hooks/AuthScreen/useLogout";
import ProfileAvatar from "../../components/Profile/ProfileAvatar";

export default function ProfileScreen({ navigation }) {

  const handleLogout = useLogout(navigation);

  return (

    <SafeAreaView className="flex-1 bg-coffee px-6">

      <View className="flex-1 justify-center">

        <View className="items-center mb-10">

          <Text className="text-3xl font-bold text-white">
            Perfil
          </Text>

          <Text className="text-gray-300 mt-2">
            Gerencie sua conta
          </Text>

        </View>


        <View className="bg-white/10 p-6 rounded-xl">

          <Text className="text-white text-lg font-semibold mb-6">
            Conta
          </Text>

          <View className="my-10">
            <ProfileAvatar />
          </View>

          <Button
            title="Sair da conta"
            onPress={handleLogout}
            variant="danger"
          />

        </View>

      </View>

    </SafeAreaView>

  );
}