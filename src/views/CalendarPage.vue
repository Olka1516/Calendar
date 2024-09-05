<template>
  <div class="container">
    <EventModal
      v-if="openModal"
      :v="v$"
      :event="event"
      @update:event="saveEvent"
      @close="closeModal"
      :add="true"
      :coordinates="{ top, left }"
      :newModal="newModal"
    />
    <h1>Calendar</h1>
    <ScheduleXCalendar :calendar-app="calendarApp">
      <template #eventModal>
        <EventModal
          :v="v$"
          :event="event"
          @update:event="editEvent"
          @close="closeModal"
          @deleteEvent="deleteEvent"
          :coordinates="{ top, left }"
          :newModal="newModal"
        />
      </template>

      <template #headerContentLeftPrepend>
        <h2 class="header-content">Calendar view</h2>
      </template>

      <template #headerContentRightAppend>
        <div class="header-content-btns">
          <button
            :class="{ active: viewCalendar === 'month-grid' }"
            @click="changeView('month-grid')"
          >
            Month
          </button>
          <hr />
          <button :class="{ active: viewCalendar === 'week' }" @click="changeView('week')">
            Week
          </button>
          <hr />
          <button :class="{ active: viewCalendar === 'day' }" @click="changeView('day')">
            Day
          </button>
        </div>
      </template>
    </ScheduleXCalendar>
  </div>
</template>

<script setup lang="ts">
import EventModal from '@/components/EventModal.vue'

import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid
} from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import '@schedule-x/theme-default/dist/index.css'

import { onMounted, reactive, ref, type Reactive } from 'vue'
import type { Event } from '@/types'
import { colorsList } from './data'
import { required, maxLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import {
  addToLocalStorageEvents,
  deleteEventFromLocalStorage,
  loadEventsFromLocalStorage,
  updateLocalStorageEvent
} from '@/services/storage'

const eventsServicePlugin = createEventsServicePlugin()
const eventModalPlugin = createEventModalPlugin()
const calendarControls = createCalendarControlsPlugin()

const openModal = ref(false)
const newModal = ref(false)
const viewCalendar = ref('month-grid')
const top = ref(0)
const left = ref(0)

const event: Reactive<Event> = reactive({
  title: '',
  start: '',
  end: '',
  time: '',
  notes: '',
  calendarId: colorsList.personal.colorName,
  id: 1
})

const rules = {
  title: { required, minLength: maxLength(30) },
  start: { required },
  end: { required },
  time: { required },
  notes: { required, minLength: maxLength(30) },
  calendarId: { required },
  id: { required }
}

const v$ = useVuelidate(rules, event)

const generateRandomId = () => Math.random().toString(36).substr(2, 9)

const formatDateTime = (event: Event) => {
  event.start = `${event.start} ${event.time}`
  event.end = event.start
}

const saveOrUpdateEvent = async (updatedEvent: Event, isNew = true) => {
  Object.assign(event, updatedEvent)
  formatDateTime(event)

  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  if (isNew) {
    event.id = generateRandomId()
    addToLocalStorageEvents(event)
    eventsServicePlugin.add(event)
  } else {
    updateLocalStorageEvent(event)
    eventsServicePlugin.update(event)
  }

  closeModal()
}

const saveEvent = (updatedEvent: Event) => {
  saveOrUpdateEvent(updatedEvent, true)
}

const editEvent = (updatedEvent: Event) => {
  saveOrUpdateEvent(updatedEvent, false)
}

const closeModal = () => {
  eventModalPlugin.close()
  openModal.value = false
  resetToDefault()
}

const deleteEvent = () => {
  eventsServicePlugin.remove(event.id)
  deleteEventFromLocalStorage(event.id)
  resetToDefault()
}

const resetToDefault = () => {
  Object.assign(event, {
    title: '',
    start: '',
    end: '',
    time: '',
    notes: '',
    calendarId: colorsList.personal.colorName,
    id: generateRandomId()
  })
}

const calendarApp = createCalendar({
  selectedDate: new Date().toISOString().split('T')[0],
  defaultView: viewMonthGrid.name,
  views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
  events: loadEventsFromLocalStorage(),
  calendars: colorsList,
  plugins: [
    createDragAndDropPlugin(),
    createCurrentTimePlugin(),
    eventModalPlugin,
    eventsServicePlugin,
    calendarControls
  ],
  callbacks: {
    onEventClick(calendarEvent) {
      newModal.value = true
      openModal.value = false
      resetToDefault()
      Object.assign(event, calendarEvent)
    },
    onClickDate(date) {
      newModal.value = true
      resetToDefault()
      event.start = date
      openModal.value = true
    },
    onClickDateTime(dateTime) {
      newModal.value = true
      openModal.value = true
      const [date, time] = dateTime.split(' ')
      event.start = date
      event.end = date
      event.time = time
      event.id = generateRandomId()
    },
    onEventUpdate(updatedEvent) {
      Object.assign(event, updatedEvent)
      event.start = event.start + ' ' + event.time
      event.end = event.start
      updateLocalStorageEvent(event)
    }
  }
})

const changeView = (type: string) => {
  calendarControls.setView(type)
  viewCalendar.value = type
}

document.addEventListener('click', (event) => {
  const calendarElement =
    document.getElementsByClassName('sx__month-grid-wrapper')[0] ||
    document.getElementsByClassName('sx__week-grid')[0]
  if (calendarElement?.contains(event.target as Node)) {
    top.value = event.pageY
    left.value = event.pageX
  } else {
    openModal.value = false
  }
})

onMounted(() => {
  setTimeout(() => {
    document.getElementsByClassName('sx__month-grid-wrapper')[0]
  }, 1000)
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/index';
@include index.calendar;
</style>
