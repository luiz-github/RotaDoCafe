import { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  updateCurrentProfilePhoto,
} from '../../services/users/userService'

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
    if (!name?.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'O nome é obrigatório.',
      })

      return {
        success: false,
      }
    }

    try {
      setUpdating(true)

      const { profile, authEmailUpdated } = await updateCurrentUserProfile({
        name: name.trim(),
        email,
      })

      setUser(profile)

      return {
        success: true,
        authEmailUpdated,
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)

      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar perfil',
      })

      return {
        success: false,
      }
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
    updateProfilePhoto,
  }
}
