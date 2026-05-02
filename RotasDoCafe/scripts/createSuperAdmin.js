import 'dotenv/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../src/services/firebase'

async function criarSuperAdmin() {
  try {
    console.log('Criando usuário super-admin...')

    const email = 'super-admin@rotadocafe.com'
    const senha = '123456'

    let userCredential

    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, senha)
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        userCredential = await signInWithEmailAndPassword(auth, email, senha)
      } else {
        throw error
      }
    }

    const uid = userCredential.user.uid

    await setDoc(doc(db, 'users', uid), {
      nome: 'Super Admin',
      email,
      role: 'super-admin',
      createdAt: serverTimestamp(),
    })

    console.log('✅ Super-admin criado com sucesso!')
    process.exit(0)
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

criarSuperAdmin()
