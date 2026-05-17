import { Alert } from 'react-native'
import { signOut } from 'firebase/auth'
import useToast from '../../components/Toast/ToastMessage'
import { auth } from '../../services/firebase'

export default function useLogout(navigation) {
  const { showSuccess, showError } = useToast()

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair do aplicativo?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth)
            navigation.replace('Auth')
            showSuccess('Logout bem-sucedido.')
          } catch (error) {
            showError('Não foi possível encerrar a sessão. Tente novamente.')
          }
        },
      },
    ])
  }
  return handleLogout
}
