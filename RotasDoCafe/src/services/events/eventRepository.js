import { addDoc, collection, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import { auth, COLLECTIONS, db } from '../firebase'

const getEventsCollection = () => collection(db, COLLECTIONS.EVENTS)

const normalizeEvent = (eventDoc) => ({
  id: eventDoc.id,
  ...eventDoc.data(),
})

const fetchEvents = async () => {
  const snapshot = await getDocs(getEventsCollection())

  const now = Date.now()

  return snapshot.docs
    .map(normalizeEvent)
    .filter((event) => {
      if (event.deletedAt != null) return false

      const eventDateTime = event.eventDateTime?.toMillis?.() ?? 0

      return eventDateTime >= now
    })
    .sort((left, right) => {
      const leftDate = left.eventDateTime?.toMillis?.() ?? 0
      const rightDate = right.eventDateTime?.toMillis?.() ?? 0

      return leftDate - rightDate
    })
}

const createEvent = async (eventData) => {
  const currentUser = auth.currentUser

  if (!currentUser) {
    throw new Error('Usuário não autenticado')
  }

  return await addDoc(getEventsCollection(), {
    ...eventData,
    createdBy: currentUser.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    deletedAt: null,
  })
}

const updateEvent = async (eventId, updatedData) => {
  await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
    ...updatedData,
    updatedAt: serverTimestamp(),
  })
}

const removeEvent = async (eventId) => {
  await updateDoc(doc(db, COLLECTIONS.EVENTS, eventId), {
    deletedAt: serverTimestamp(),
  })
}

export { fetchEvents, createEvent, updateEvent, removeEvent }
