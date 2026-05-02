import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import useToast from '../../components/Toast/ToastMessage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth } from '../../services/firebase'
import { handleFirebaseError } from '../../services/validations/firebaseErrorHandler'
import { validateLoginForm } from '../../services/validations/loginValidation'

export default function useLogin(navigation) {
  const [loading, setLoading] = useState(false)
  const [firstLogin, setFirstLogin] = useState(true)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    const loadFirstLogin = async () => {
      try {
        const value = await AsyncStorage.getItem('firstLogin')

        if (value === 'false') {
          setFirstLogin(false)
        }
      } catch (error) {
        console.log('Erro ao carregar firstLogin:', error)
      }
    }

    loadFirstLogin()
  }, [])

  const handleLogin = async (email, password) => {
    const validation = validateLoginForm({ email, password })

    if (!validation.isValid) {
      return showError(Object.values(validation.errors)[0])
    }

    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)

      try {
        await AsyncStorage.setItem('firstLogin', 'false')
      } catch (error) {
        console.log('Erro ao salvar firstLogin:', error)
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
