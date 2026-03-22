import { useState } from 'react'
import useToast from '../../components/Toast/ToastMessage'

export default function useLogin(navigation) {
  const [loading, setLoading] = useState(false)
  const { showSuccess, showError } = useToast()

  const MOCK_USER = {
    username: 'admin',
    password: '123',
  }

  const handleLogin = (username, password) => {
    if (!username || !password) {
      return showError("Preencha todos os campos para continuar.")
    }

    setLoading(true)

    setTimeout(() => {
      if (username !== MOCK_USER.username || password !== MOCK_USER.password) {
        setLoading(false)
        return showError("Usuário ou senha inválidos.")
      }

      setLoading(false)
      showSuccess("Autenticado com sucesso.")
      navigation.replace('App')
    }, 1000)
  }

  return { handleLogin, loading }
}
