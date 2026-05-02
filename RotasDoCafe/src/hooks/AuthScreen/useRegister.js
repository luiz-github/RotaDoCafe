import { useState } from 'react'
import Toast from 'react-native-toast-message'
import { validateRegisterForm } from '../../services/validations/registerValidation'
import { handleFirebaseError } from '../../services/validations/firebaseErrorHandler'
import { registerUserInFirebase } from '../../services/auth/registerUser'

export default function useRegister(navigation) {
  const [loading, setLoading] = useState(false)

  const validate = ({ username, email, password, confirmPassword }) => {
    const validation = validateRegisterForm({ username, email, password, confirmPassword })

    if (!validation.isValid) {
      // Mostra o primeiro erro
      const firstError = Object.values(validation.errors)[0]
      Toast.show({
        type: 'error',
        text1: 'Erro de validação',
        text2: firstError,
      })
      return false
    }

    return true
  }

  const handleRegister = async ({ username, email, password, confirmPassword }) => {
    if (!validate({ username, email, password, confirmPassword })) return

    try {
      setLoading(true)

      await registerUserInFirebase({ username, email, password })

      Toast.show({
        type: 'success',
        text1: 'Conta criada 🎉',
      })

      navigation.navigate('Auth', { email })
    } catch (error) {
      const errorResponse = handleFirebaseError(error)

      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: errorResponse.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    handleRegister,
  }
}
