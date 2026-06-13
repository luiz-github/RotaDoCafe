import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as NavigationBar from 'expo-navigation-bar'
import colors from './src/styles/colors'
import Toast from 'react-native-toast-message'

import AuthScreen from './src/screens/Auth/AuthScreen'
import BottomTabs from './src/components/BottomTabs/BottomTabs'
import RegisterScreen from './src/screens/Auth/RegisterScreen'
import ForgotPasswordScreen from './src/screens/Auth/ForgotPasswordScreen'
import ManageEventsScreen from './src/screens/Eventos/ManageEventsScreen'
import CreateEventScreen from './src/screens/Eventos/CreateEventScreen'
import EditEventScreen from './src/screens/Eventos/EditEventScreen'
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true);

import './src/styles/global.css'
import EventDetailsScreen from './src/screens/Eventos/EventDetailsScreen';

const Stack = createNativeStackNavigator()

export default function App() {

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(colors.background)
    NavigationBar.setButtonStyleAsync("light")
  }, [])

  return (
    <GestureHandlerRootView>

      <NavigationContainer>

        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{
            headerShown: false,
          }}
        >

          <Stack.Screen
            name="Auth"
            component={AuthScreen}
          />

          <Stack.Screen
            name="App"
            component={BottomTabs}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />

          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />

          <Stack.Screen
            name="ManageEvents"
            component={ManageEventsScreen}
          />

          <Stack.Screen
            name="CreateEvent"
            component={CreateEventScreen}
          />

          <Stack.Screen
            name="EditEvent"
            component={EditEventScreen}
          />

          <Stack.Screen
            name="EventDetails"
            component={EventDetailsScreen}
          />

        </Stack.Navigator>
        <Toast />

      </NavigationContainer>
    </GestureHandlerRootView>
  )
}