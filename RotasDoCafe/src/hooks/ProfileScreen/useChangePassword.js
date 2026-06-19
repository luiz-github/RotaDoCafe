import { useState } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'

import { auth } from '../../services/firebase'
import { saveBiometricSecret } from '../../services/biometric/biometricStorage'
import useToast from '../../components/Toast/ToastMessage'

export default function useChangePassword() {
  const [loading, setLoading] = useState(false)
   const { showError } = useToast()

  const validate = ({ currentPassword, newPassword, confirmPassword }) => {
    const wantsToChangePassword = currentPassword || newPassword || confirmPassword

    if (!wantsToChangePassword) {
      return false
    }

    if (!currentPassword) {
      showError('Informe sua senha atual.')

      return null
    }

    if (!newPassword) {
      showError('Informe a nova senha.')

      return null
    }

    if (!confirmPassword) {
      showError('Confirme a nova senha.')

      return null
    }

    if (newPassword !== confirmPassword) {
      showError('As senhas não coincidem.')

      return null
    }

    return true
  }
  const handleSave = async ({ currentPassword, newPassword, confirmPassword, onSuccess }) => {
    try {
      setLoading(true)

      const validation = validate({
        currentPassword,
        newPassword,
        confirmPassword,
      })

      if (validation === null) {
        return false
      }

      if (validation) {
        const user = auth.currentUser

        if (!user || !user.email) {
          throw new Error('Usuário não autenticado.')
        }

        const credential = EmailAuthProvider.credential(user.email, currentPassword)

        await reauthenticateWithCredential(user, credential)

        await updatePassword(user, newPassword)

        await saveBiometricSecret(user.email, newPassword)
      }

      if (onSuccess) {
        onSuccess()
      }

      return true
    } catch (error) {
      if (error?.code === 'auth/invalid-credential') {
        showError('A senha atual informada não confere.')

        return false
      }

      showError('Falha ao salvar dados.')

      return false
    } finally {
      setLoading(false)
    }
  }
  return {
    loading,
    handleSave,
  }
}
