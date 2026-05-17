import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'

const sendResetEmail = async (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('E-mail inválido')
  }

  try {
    await sendPasswordResetEmail(auth, email.trim())
    return { success: true }
  } catch (error) {
    const message = error?.message || 'Erro ao enviar email de recuperação'
    return { success: false, message }
  }
}

export { sendResetEmail }
