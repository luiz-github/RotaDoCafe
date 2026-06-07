import { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { getCurrentUserProfile, updateCurrentUserProfile, updateCurrentProfilePhoto } from '../../services/users/userService'

export default function useUserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchUser = async () => {
    try {
      setLoading(true)
      const profile = await getCurrentUserProfile()
      setUser(profile)
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)

      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar perfil',
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfilePhoto = async (base64Image) => {
    try {
      setUpdating(true)
      await updateCurrentProfilePhoto(base64Image)
      
      setUser((prev) => ({
        ...prev,
        photoURL: base64Image,
      }))

      Toast.show({
        type: 'success',
        text1: 'Foto atualizada!',
      })
      
      return true
    } catch (error) {
      console.error('Erro ao atualizar foto do perfil:', error)

      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar foto do perfil',
      })

      return false
    } finally {
      setUpdating(false)
    }
  }

  const updateProfile = async ({ name, email }) => {
    try {
      setUpdating(true)
      const { profile, authEmailUpdated } = await updateCurrentUserProfile({
        name,
        email,
      })

      setUser(profile)

      if (!authEmailUpdated) {
        Toast.show({
          type: 'info',
          text1: 'Email salvo, mas precisa relogar',
        })
      }

      Toast.show({
        type: 'success',
        text1: 'Perfil atualizado!',
      })

      return true
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)

      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar perfil',
      })

      return false
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return {
    user,
    loading,
    updating,
    refetch: fetchUser,
    updateProfile,
    updateProfilePhoto
  }
}
