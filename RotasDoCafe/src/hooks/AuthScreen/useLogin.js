import { useState } from 'react'
import { Alert } from 'react-native'

export default function useLogin(navigation) {
  const [loading, setLoading] = useState(false)

  const MOCK_USER = {
    username: 'admin',
    password: '123',
  }

  const handleLogin = (username, password) => {
    if (!username || !password) {
      Alert.alert('Erro', 'Preencha todos os campos para continuar.')
      return
    }

    setLoading(true)

    setTimeout(() => {
      if (username !== MOCK_USER.username || password !== MOCK_USER.password) {
        setLoading(false)
        Alert.alert('Erro', 'Usuário ou senha inválidos.')
        return
      }

      setLoading(false)
      Alert.alert('Sucesso', `Bem-vindo, ${MOCK_USER.username}!`)
      navigation.replace('App')
    }, 1000)
  }

  return { handleLogin, loading }
}
