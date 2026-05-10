import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { signInWithEmailAndPassword } from 'firebase/auth'
import useToast from '../../components/Toast/ToastMessage'
import { auth } from '../../services/firebase'
import { handleFirebaseError } from '../../services/validations/firebaseErrorHandler'
import { validateLoginForm } from '../../services/validations/loginValidation'
import { getUserByEmail, markUserFirstLoginAsCompleted } from '../../services/users/userService'

export default function useLogin(navigation, email) {
  const [loading, setLoading] = useState(false)
  const [firstLogin, setFirstLogin] = useState(true)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    let isActive = true

    const loadFirstLogin = async () => {
      const typedEmail = email?.trim()

      if (!typedEmail) {
        if (isActive) {
          setFirstLogin(true)
        }
        return
      }

      try {
        const userRecord = await getUserByEmail(typedEmail)

        if (isActive) {
          setFirstLogin(userRecord?.firstLogin ?? true)
        }
      } catch (error) {
        console.log('Erro ao buscar firstLogin do Firestore:', error)

        if (isActive) {
          setFirstLogin(true)
        }
      }
    }

    const timer = setTimeout(loadFirstLogin, 300)

    return () => {
      isActive = false
      clearTimeout(timer)
    }
  }, [email])

  const handleLogin = async (email, password) => {
    const validation = validateLoginForm({ email, password })

    if (!validation.isValid) {
      return showError(Object.values(validation.errors)[0])
    }

    setLoading(true)

    try {
      const normalizedEmail = email.trim()
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password)

      await markUserFirstLoginAsCompleted(userCredential.user.uid, normalizedEmail)

      // Salva o último email usado para facilitar preenchimento automático
      try {
        await AsyncStorage.setItem('lastEmail', normalizedEmail)
      } catch (e) {
        console.warn('Não foi possível salvar lastEmail:', e)
      }

      setFirstLogin(false)
      showSuccess('Autenticado com sucesso.')
      navigation.replace('App')
    } catch (error) {
      const firebaseError = handleFirebaseError(error)
      showError(firebaseError.message)
    } finally {
      setLoading(false)
    }
  }

  return { handleLogin, loading, firstLogin }
}
