import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AuthScreen from './src/screens/Auth/AuthScreen'
import BottomTabs from './src/components/BottomTabs/BottomTabs'

import './src/styles/global.css'

const Stack = createNativeStackNavigator()

export default function App() {
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

    </NavigationContainer>
  )
}