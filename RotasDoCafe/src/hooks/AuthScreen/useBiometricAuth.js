import { useEffect, useState } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'
import useToast from '../../components/Toast/ToastMessage'
import { auth } from '../../services/firebase'
import {
  isBiometricEmailMatch,
  normalizeEmail,
  getBiometricSecret,
} from '../../services/biometric/biometricStorage'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function useBiometricAuth(navigation, typedEmail) {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false)
  const [isBiometricEnabledForEmail, setIsBiometricEnabledForEmail] = useState(false)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    checkBiometricAvailability()
  }, [])

  useEffect(() => {
    let isActive = true

    const run = async () => {
      setIsBiometricEnabledForEmail(false)

      try {
        const matches = await isBiometricEmailMatch(typedEmail)

        if (isActive) {
          setIsBiometricEnabledForEmail(matches)
        }
      } catch {
        if (isActive) setIsBiometricEnabledForEmail(false)
      }
    }

    run()

    return () => {
      isActive = false
    }
  }, [typedEmail])

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    const enrolled = await LocalAuthentication.isEnrolledAsync()
    setIsBiometricAvailable(compatible && enrolled)
  }

  const handleBiometricAuth = async (emailToUse) => {
    if (!isBiometricEnabledForEmail) {
      showError('A biometria está vinculada a outro e-mail. Entre com senha para este usuário.')
      return
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique para acessar o app',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      })

      if (result.success) {
        const currentTypedEmail = normalizeEmail(emailToUse || typedEmail)

        const secret = await getBiometricSecret(currentTypedEmail)

        if (!secret) {
          showError(
            'Biometria não tem credenciais salvas para este e-mail. Entre com senha uma vez para ativar.',
          )
          return
        }

        try {
          if (auth.currentUser && normalizeEmail(auth.currentUser.email) !== currentTypedEmail) {
            await auth.signOut()
          }

          await signInWithEmailAndPassword(auth, currentTypedEmail, secret)
          navigation.replace('App')
          showSuccess('Autenticação bem-sucedida.')
        } catch (signinError) {
          showError('Falha ao autenticar com credenciais biométricas. Entre com senha.')
        }
      } else {
        showError('Autenticação falhou. Tente novamente.')
      }
    } catch (error) {
      showError('Ocorreu um erro durante a autenticação.')
    }
  }

  return {
    isBiometricAvailable,
    isBiometricEnabledForEmail,
    handleBiometricAuth,
  }
}
