import {
  createEvent as createEventOnRepository,
  fetchEvents,
  removeEvent,
  updateEvent as updateEventOnRepository,
} from './eventRepository'

export const getEvents = async () => {
  return await fetchEvents()
}

export const createEvent = async (eventData) => {
  return await createEventOnRepository(eventData)
}

export const deleteEvent = async (eventId) => {
  return await removeEvent(eventId)
}

export const updateEvent = async (eventId, updatedData) => {
  await updateEventOnRepository(eventId, updatedData)
}
