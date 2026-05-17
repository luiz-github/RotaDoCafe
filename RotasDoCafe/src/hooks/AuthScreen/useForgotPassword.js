import { useState } from 'react'
import Toast from 'react-native-toast-message'
import { sendResetEmail } from '../../services/auth/forgotPassword'
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

      const result = await sendResetEmail(email.trim())

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'E-mail enviado 📩',
          text2: 'Verifique sua caixa de entrada',
        })

        navigation.goBack()
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao enviar e-mail',
          text2: result.message,
        })
      }
    } catch (error) {
      console.error(error)

      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar e-mail',
        text2: 'Por favor, tente novamente mais tarde.',
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
