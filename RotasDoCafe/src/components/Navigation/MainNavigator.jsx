import { NavigationContainer } from "@react-navigation/native";
import BottomTabs from "../BottomTabs/BottomTabs";

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}