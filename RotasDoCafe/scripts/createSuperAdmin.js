import 'dotenv/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { doc, serverTimestamp, setDoc, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

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
      uid,
      username: 'Super Admin',
      firstLogin: true,
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
