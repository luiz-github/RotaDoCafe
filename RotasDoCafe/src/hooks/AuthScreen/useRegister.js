import { useState } from 'react'
import useToast from '../../components/Toast/ToastMessage'
import { validateRegisterForm } from '../../services/validations/registerValidation'
import { handleFirebaseError } from '../../services/validations/firebaseErrorHandler'
import { registerUserInFirebase } from '../../services/auth/registerUser'

export default function useRegister(navigation) {
  const [loading, setLoading] = useState(false)
  const { showSuccess, showError } = useToast()

  const validate = ({ username, email, password, confirmPassword }) => {
    const validation = validateRegisterForm({ username, email, password, confirmPassword })

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0]
      showError(firstError)
      return false
    }

    return true
  }

  const handleRegister = async ({ username, email, password, confirmPassword }) => {
    if (!validate({ username, email, password, confirmPassword })) return

    try {
      setLoading(true)

      await registerUserInFirebase({ username, email, password })

      showSuccess('Conta criada 🎉')

      navigation.navigate('Auth', { email })
    } catch (error) {
      const errorResponse = handleFirebaseError(error)

      showError(errorResponse.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    handleRegister,
  }
}
