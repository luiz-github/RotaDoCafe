import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import Toast from 'react-native-toast-message'
import { auth } from '../../services/firebase'
import { validateEmail } from '../../services/validations/loginValidation'

export default function useForgotPassword(navigation) {
  const [loading, setLoading] = useState(false)

  const handleForgotPassword = async (email) => {
    const validation = validateEmail(email)

    if (!validation.isValid) {
      Toast.show({
        type: 'error',
        text1: 'Campo inválido',
        text2: validation.error,
      })
      return
    }

    try {
      setLoading(true)

      await sendPasswordResetEmail(auth, email.trim())

      Toast.show({
        type: 'success',
        text1: 'E-mail enviado 📩',
        text2: 'Verifique sua caixa de entrada',
      })

      navigation.goBack()
    } catch (error) {
      console.error(error)

      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar e-mail',
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    handleForgotPassword,
    loading,
  }
}
