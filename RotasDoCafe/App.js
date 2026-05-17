import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as NavigationBar from 'expo-navigation-bar'
import colors from './src/styles/colors'
import Toast from 'react-native-toast-message'

import AuthScreen from './src/screens/Auth/AuthScreen'
import BottomTabs from './src/components/BottomTabs/BottomTabs'

import './src/styles/global.css'

const Stack = createNativeStackNavigator()

export default function App() {

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(colors.background)
    NavigationBar.setButtonStyleAsync("light")
  }, [])

  return (
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

      </Stack.Navigator>
      <Toast />

    </NavigationContainer>
  )
}