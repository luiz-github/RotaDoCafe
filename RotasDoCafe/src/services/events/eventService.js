import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy,
    serverTimestamp,

} from 'firebase/firestore'

import { db, auth } from '../firebase'

export const getEvents = async () => {

    const q = query(collection(db, 'events'), orderBy('createdAt', 'asc'))

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};


export const createEvent = async (eventData) => {

    const user = auth.currentUser

    if (!user) {
        throw new Error('Usuário não autenticado')
    }

    return await addDoc(collection(db, 'events'), {
        ...eventData,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

}; 


export const deleteEvent = async (eventId) => {
    await deleteDoc(doc(db, 'events', eventId));
}

export const updateEvent = async (eventId, updatedData) => {
    await updateDoc(doc(db, 'events', eventId), {
        ...updatedData,
        updatedAt: serverTimestamp(),
    });
}