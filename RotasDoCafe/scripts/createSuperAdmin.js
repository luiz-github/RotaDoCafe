import 'dotenv/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { doc, serverTimestamp, setDoc, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { COLLECTIONS } from '../src/services/firebaseCore/collections.js'
import { firebaseConfig } from '../src/services/firebaseCore/config.js'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function criarSuperAdmin() {
  try {
    console.log('🚀 Criando usuário super-admin...')

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

    await setDoc(doc(db, COLLECTIONS.USERS, uid), {
      uid,
      username: 'Super Admin',
      firstLogin: true,
      email,
      role: 'super-admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null,
    })

    console.log('✅ Super-admin criado com sucesso!')
    process.exit(0)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

criarSuperAdmin()
