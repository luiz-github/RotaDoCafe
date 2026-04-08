import { useEffect, useState } from 'react'
import useToast from '../../components/Toast/ToastMessage'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function useLogin(navigation) {
  const [loading, setLoading] = useState(false)
  const [firstLogin, setFirstLogin] = useState(true)
  const { showSuccess, showError } = useToast()

  const MOCK_USER = {
    username: 'admin',
    password: '123',
  }

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

  const handleLogin = async (username, password) => {
    if (!username || !password) {
      return showError('Preencha todos os campos para continuar.')
    }

    setLoading(true)

    setTimeout(async () => {
      if (username !== MOCK_USER.username || password !== MOCK_USER.password) {
        setLoading(false)
        return showError('Usuário ou senha inválidos.')
      }

      try {
        await AsyncStorage.setItem('firstLogin', 'false')
      } catch (error) {
        console.log('Erro ao salvar firstLogin:', error)
      }

      setFirstLogin(false)
      setLoading(false)
      showSuccess("Autenticado com sucesso.")
      navigation.replace('App')
    }, 1000)
  }

  return { handleLogin, loading, firstLogin }
}
