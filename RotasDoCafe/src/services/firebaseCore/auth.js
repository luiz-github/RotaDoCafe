import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { app } from './app'

let auth

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
} catch (error) {
  auth = getAuth(app)
}

export { auth }
