import { useState } from 'react'
import useToast from '../../components/Toast/ToastMessage'
import { sendResetEmail } from '../../services/auth/forgotPassword'
import { validateEmail } from '../../services/validations/loginValidation'

export default function useForgotPassword(navigation) {
  const [loading, setLoading] = useState(false)
   const { showSuccess, showError } = useToast() 

  const handleForgotPassword = async (email) => {
    const validation = validateEmail(email)

    if (!validation.isValid) {
      showError(validation.error)
      return
    }

    try {
      setLoading(true)

      const result = await sendResetEmail(email.trim())

      if (result.success) {
        showSuccess('E-mail enviado 📩')
        navigation.goBack()
      } else {
        showError('Erro ao enviar e-mail')
      }
    } catch (error) {
      console.error(error)

      showError('Erro ao enviar e-mail')
    } finally {
      setLoading(false)
    }
  }

  return {
    handleForgotPassword,
    loading,
  }
}
