import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../src/services/firebase.js'

async function criarSuperAdmin() {
  try {
    console.log('Criando usuário super-admin...')

    const email = 'super-admin@rotadocafe.com'
    const senha = '123456'

    const userCredential = await createUserWithEmailAndPassword(auth, email, senha)

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
