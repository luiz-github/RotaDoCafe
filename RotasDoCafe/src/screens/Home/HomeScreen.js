import { View, Text, Alert } from "react-native";
import Button from "../../components/Button/Button";

export default function HomeScreen({ navigation }) {

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair do aplicativo?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => navigation.replace("Auth"),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-coffee items-center justify-center p-5">

      <Text className="text-3xl font-bold text-white mb-2">
        Rotas do Café
      </Text>

      <Text className="text-xl text-gray-300 mb-8">
        Bem-vindo à Home!
      </Text>

      <View className="bg-white/10 p-5 rounded-lg mb-10 w-full">

        <Text className="text-white text-base text-center leading-6">
          Você está autenticado e pronto para usar o aplicativo.
        </Text>

      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="danger"
      />

    </View>
  );
}