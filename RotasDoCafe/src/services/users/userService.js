import { updateEmail } from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { auth, COLLECTIONS, db } from '../firebase'

const normalizeEmail = (email) => email?.trim().toLowerCase() || ''

const getCurrentUser = () => {
  return auth.currentUser
}

const getAuthenticatedUser = () => {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    throw new Error('Usuário não autenticado')
  }

  return currentUser
}

const getUserDocument = async (userId) => {
  return await getDoc(doc(db, COLLECTIONS.USERS, userId))
}

const getUserByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail) {
    return null
  }

  const byNormalizedEmail = await getDocs(
    query(
      collection(db, COLLECTIONS.USERS),
      where('emailNormalized', '==', normalizedEmail),
      limit(1),
    ),
  )

  if (!byNormalizedEmail.empty) {
    const snapshot = byNormalizedEmail.docs[0]

    return {
      id: snapshot.id,
      ...snapshot.data(),
    }
  }

  const byEmail = await getDocs(
    query(collection(db, COLLECTIONS.USERS), where('email', '==', normalizedEmail), limit(1)),
  )

  if (!byEmail.empty) {
    const snapshot = byEmail.docs[0]

    return {
      id: snapshot.id,
      ...snapshot.data(),
    }
  }

  return null
}

const mapUserProfile = (userId, data, fallbackEmail) => ({
  uid: userId,
  name: data?.username || '',
  email: data?.email || fallbackEmail || '',
  role: data?.role || 'user',
  firstLogin: data?.firstLogin ?? false,
  biometricEnabled: data?.biometricEnabled ?? false,
})

const getCurrentUserProfile = async () => {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    return null
  }

  const snapshot = await getUserDocument(currentUser.uid)

  if (snapshot.exists()) {
    return mapUserProfile(currentUser.uid, snapshot.data(), currentUser.email)
  }

  return mapUserProfile(currentUser.uid, null, currentUser.email)
}

const getCurrentUserRole = async () => {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    return null
  }

  const snapshot = await getUserDocument(currentUser.uid)

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.data()?.role ?? null
}

const updateCurrentUserProfile = async ({ name, email }) => {
  const currentUser = getAuthenticatedUser()
  const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid)
  const normalizedEmail = normalizeEmail(email)

  await updateDoc(userRef, {
    username: name,
    email: normalizedEmail,
    emailNormalized: normalizedEmail,
  })

  let authEmailUpdated = true

  if (email && email !== currentUser.email) {
    try {
      await updateEmail(currentUser, email)
    } catch (error) {
      authEmailUpdated = false
      console.warn('Erro ao atualizar email no Auth:', error)
    }
  }

  const profile = await getCurrentUserProfile()

  return {
    profile,
    authEmailUpdated,
  }
}

const markUserFirstLoginAsCompleted = async (userId, email) => {
  if (!userId) {
    return false
  }

  const normalizedEmail = normalizeEmail(email)

  await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
    firstLogin: false,
    ...(normalizedEmail ? { email: normalizedEmail, emailNormalized: normalizedEmail } : {}),
  })

  return true
}

export {
  getCurrentUserProfile,
  getCurrentUserRole,
  getUserByEmail,
  markUserFirstLoginAsCompleted,
  updateCurrentUserProfile,
}
