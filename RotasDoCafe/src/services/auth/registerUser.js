import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, COLLECTIONS, db } from '../firebase'

const registerUserInFirebase = async ({ username, email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user
  const normalizedEmail = email.trim().toLowerCase()

  try {
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      uid: user.uid,
      username,
      email: normalizedEmail,
      emailNormalized: normalizedEmail,
      role: 'user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null,
      firstLogin: true,
    })

    return {
      user,
    }
  } catch (error) {
    try {
      await deleteUser(user)
    } catch (deleteError) {
      console.error('Erro ao remover usuário após falha no cadastro:', deleteError)
    }

    throw error
  }
}

export { registerUserInFirebase }
