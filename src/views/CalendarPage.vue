<template>
  <div class="container">
    <EventModal
      v-if="openModal"
      :event="event"
      @update:event="saveEvent"
      @close="closeModal"
      :add="true"
      :coordinates="{ top, left }"
    />
    <h1>Calendar</h1>
    <ScheduleXCalendar :calendar-app="calendarApp">
      <template #eventModal>
        <EventModal
          :event="event"
          @update:event="editEvent"
          @close="closeModal"
          @deleteEvent="deleteEvent"
          :coordinates="{ top, left }"
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
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import '@schedule-x/theme-default/dist/index.css'

import { onMounted, reactive, ref, type Reactive, type Ref } from 'vue'
import type { Event } from '@/types'
import { colorsList } from './data'

const eventsServicePlugin = createEventsServicePlugin()
const eventModalPlugin = createEventModalPlugin()
const calendarControls = createCalendarControlsPlugin()

const gridCalendarContainer: Ref<Element | null> = ref(null)
const gridWeek: Ref<Element | null> = ref(null)
const openModal = ref(false)
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

const calendarApp = createCalendar({
  selectedDate: new Date().toISOString().split('T')[0],
  defaultView: viewMonthGrid.name,
  views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
  events: [],
  calendars: colorsList,
  plugins: [createDragAndDropPlugin(), eventModalPlugin, eventsServicePlugin, calendarControls],
  callbacks: {
    onEventClick(calendarEvent) {
      event.title = calendarEvent.title!
      event.start = calendarEvent.start
      event.end = calendarEvent.end
      event.time = calendarEvent.time
      event.notes = calendarEvent.notes
      event.calendarId = calendarEvent.calendarId!
      event.id = calendarEvent.id
    },

    onClickDate(date) {
      event.start = date
      openModal.value = true
    },

    onClickDateTime(dateTime) {
      resetToDefault()
      event.start = dateTime.split(' ')[0]
      event.time = dateTime.split(' ')[1]
      openModal.value = true
    }
  }
})

const resetToDefault = () => {
  event.title = ''
  event.start = ''
  event.end = ''
  event.time = ''
  event.notes = ''
  event.calendarId = colorsList.personal.colorName
  event.id = 2
}
const addToEvents = () => {
  event.end = event.start
  eventsServicePlugin.add(event)
  resetToDefault()
}

const updateEvents = () => {
  event.end = event.start
  eventsServicePlugin.update(event)
  resetToDefault()
}

const saveEvent = (updatedEvent: Event) => {
  Object.assign(event, updatedEvent)
  addToEvents()
}

const editEvent = (updatedEvent: Event) => {
  Object.assign(event, updatedEvent)
  updateEvents()
}

const closeModal = () => {
  eventModalPlugin.close()
  openModal.value = false
  resetToDefault()
}

const deleteEvent = () => {
  eventsServicePlugin.remove(event.id)
  resetToDefault()
}

const changeView = (type: string) => {
  calendarControls.setView(type)
  viewCalendar.value = type
}

document.addEventListener('click', function (event) {
  gridCalendarContainer.value = document.getElementsByClassName('sx__month-grid-wrapper')[0]
  gridWeek.value = document.getElementsByClassName('sx__week-grid')[0]
  if (
    (gridCalendarContainer.value && gridCalendarContainer.value.contains(event.target)) ||
    (gridWeek.value && gridWeek.value.contains(event.target))
  ) {
    top.value = event.pageY
    left.value = event.pageX
  } else {
    openModal.value = false
  }
})

const getGridCalendarContainer = () => {
  gridCalendarContainer.value = document.getElementsByClassName('sx__month-grid-wrapper')[0]
}

onMounted(() => {
  setTimeout(getGridCalendarContainer, 1000)
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/index';
@include index.calendar;
</style>
