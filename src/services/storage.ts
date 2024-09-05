import type { Event } from '@/types'

const LOCAL_STORAGE_KEY = 'calendarEvents'

export const loadEventsFromLocalStorage = () => {
  const storedEvents = localStorage.getItem(LOCAL_STORAGE_KEY)
  return storedEvents ? JSON.parse(storedEvents) : []
}

export const saveEventsToLocalStorage = (events: Event[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events))
}

export const deleteEventFromLocalStorage = (eventId: number | string) => {
  const storedEvents = loadEventsFromLocalStorage()
  const updatedEvents = storedEvents.filter((e: Event) => e.id !== eventId)
  saveEventsToLocalStorage(updatedEvents)
}

export const addToLocalStorageEvents = (event: Event) => {
  const storedEvents = loadEventsFromLocalStorage()
  storedEvents.push(event)
  saveEventsToLocalStorage(storedEvents)
}

export const updateLocalStorageEvent = (updatedEvent: Event) => {
  const storedEvents = loadEventsFromLocalStorage()
  const updatedEvents = storedEvents.map((e: Event) =>
    e.id === updatedEvent.id ? updatedEvent : e
  )
  saveEventsToLocalStorage(updatedEvents)
}
