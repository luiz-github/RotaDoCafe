import { createUserWithEmailAndPassword, deleteUser, updateProfile } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const registerUserInFirebase = async ({ username, email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  try {
    await updateProfile(user, {
      displayName: username,
    })

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      username,
      email,
      displayName: username,
      createdAt: serverTimestamp(),
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
