import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import Button from '../../components/Button'

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
        <Button title="Entrar com Biometria" onPress={handleBiometricAuth} variant="primary" />
      ) : (
        <Text style={styles.errorText}>Dispositivo não compatível com biometria</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6F4E37',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#DDD',
    marginBottom: 40,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
})
