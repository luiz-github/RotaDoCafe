import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import Button from '../../components/Button/Button'
import styles from './styles'

export default function AuthScreen({ navigation }) {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkBiometricAvailability()
  }, [])

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    const enrolled = await LocalAuthentication.isEnrolledAsync()

    if (compatible && enrolled) {
      setIsBiometricAvailable(true)
    } else {
      setIsBiometricAvailable(false)
    }
  }

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique para acessar o app',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      })

      if (result.success) {
        setIsAuthenticated(true)
        navigation.replace('Home')
      } else {
        Alert.alert('Erro', 'Autenticação falhou. Tente novamente.')
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante a autenticação.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rotas do Café</Text>
      <Text style={styles.subtitle}>Bem-vindo!</Text>

      {isBiometricAvailable ? (
        <Button.Primary
          title="Entrar com Biometria"
          onPress={handleBiometricAuth}
        />
      ) : (
        <Text style={styles.errorText}>
          Dispositivo não compatível com biometria
        </Text>
      )}
    </View>
  )
}
