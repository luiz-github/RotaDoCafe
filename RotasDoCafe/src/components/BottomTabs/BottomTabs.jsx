import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../../screens/Home/HomeScreen";
import ExploreScreen from "../../screens/Explore/ExploreScreen";
import MapScreen from "../../screens/Map/MapScreen";
import EventosScreen from "../../screens/Eventos/EventosScreen";
import ProfileScreen from "../../screens/Profile/ProfileScreen";

import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();

  return (

    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#2b1810",
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        
        labelStyle: {
          margin: 0
        },
        
        tabBarIndicatorStyle: {height: 0},

        tabBarActiveTintColor: "#fbbf24",
        tabBarInactiveTintColor: "#cbd5e1",

        tabBarShowIcon: true
      }}
    >

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Explorar"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="compass" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Mapa"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Eventos"
        component={EventosScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="musical-notes" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={22} color={color} />
          ),
        }}
      />

    </Tab.Navigator>

  );
}