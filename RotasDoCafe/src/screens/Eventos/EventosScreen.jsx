import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventosScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 items-center justify-center bg-coffee">
      <Text className="text-white text-xl">Eventos</Text>
    </SafeAreaView>
  );
}