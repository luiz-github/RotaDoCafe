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

    const email = process.env.EXPO_PUBLIC_SUPER_ADMIN_EMAIL
    const senha = process.env.EXPO_PUBLIC_SUPER_ADMIN_PASSWORD

    if (!email || !senha) {
      throw new Error(
        'EXPO_PUBLIC_SUPER_ADMIN_EMAIL e EXPO_PUBLIC_SUPER_ADMIN_PASSWORD devem estar definidos no .env',
      )
    }

    let userCredential

    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, senha)

      console.log('✅ Usuário criado no Firebase Auth')
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️  Usuário já existe. Fazendo login...')

        userCredential = await signInWithEmailAndPassword(auth, email, senha)
      } else {
        throw error
      }
    }

    const uid = userCredential.user.uid

    await setDoc(
      doc(db, COLLECTIONS.USERS, uid),
      {
        uid,
        username: 'Super Admin',
        firstLogin: true,
        email,
        role: 'super-admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deletedAt: null,
      },
      { merge: true },
    )

    console.log('✅ Super-admin criado/atualizado com sucesso!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

criarSuperAdmin()
