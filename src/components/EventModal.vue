<template>
  <div
    @click="stop($event)"
    class="calendar-event-modal"
    :class="{ 'calendarPage-add': add }"
    :style="computedModalStyles"
  >
    <div class="calendar-event-modal-content">
      <button class="calendar-event-modal-exit" @click="closeModal">
        <img src="@/assets/pictures/icons/exit.svg" alt="" />
      </button>
      <div class="field">
        <IText name="event name" v-model="localEvent.title" :v="v.title" :newModal="newModal" />
      </div>
      <div class="field">
        <IDate name="event date" v-model="localEvent.start" :v="v.start" :newModal="newModal" />
      </div>
      <div class="field">
        <ITime name="event time" v-model="localEvent.time" :v="v.time" :newModal="newModal" />
      </div>
      <div class="field">
        <IText name="notes" v-model="localEvent.notes" :v="v.notes" :newModal="newModal" />
      </div>
      <div class="field">
        <IColor name="event color" v-model="localEvent.calendarId" />
      </div>
    </div>
    <div class="calendar-event-modal-btns">
      <button v-if="add" class="calendar-event-modal-cancel" @click="closeModal">Cancel</button>
      <button v-else class="calendar-event-modal-cancel" @click="deleteEvent">Discard</button>
      <button v-if="add" @click="saveEvent">Save</button>
      <button v-else @click="saveEvent">Edit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import IText from '@/components/inputs/IText.vue'
import IDate from '@/components/inputs/IDate.vue'
import ITime from '@/components/inputs/ITime.vue'
import IColor from '@/components/inputs/IColor.vue'
import type { Error, Event } from '@/types'

const props = defineProps<{
  event: Event
  add?: boolean
  coordinates: { top: number; left: number }
  v: {
    title: Error
    start: Error
    time: Error
    notes: Error
  }
  newModal: boolean
}>()

const emit = defineEmits(['update:event', 'close', 'deleteEvent'])

const localEvent = reactive({ ...props.event })

const computedModalStyles = computed(() => {
  return {
    '--top': `${props.coordinates.top + document.body.scrollTop + scrollY + 40}px`,
    '--left': `${props.coordinates.left > 680 ? props.coordinates.left - 300 : props.coordinates.left - 100}px`
  }
})

const saveEvent = () => {
  emit('update:event', localEvent)
}

const closeModal = () => {
  emit('close')
}

const deleteEvent = () => {
  emit('deleteEvent')
  emit('close')
}

const stop = (event: any) => {
  event.stopPropagation()
}

watch(
  () => props.event.start,
  () => {
    localEvent.start = props.event.start
  }
)

watch(
  () => props.event.time,
  () => {
    localEvent.time = props.event.time
  }
)
</script>

<style scoped lang="scss">
@use '@/assets/styles/index';
@include index.calendar-modal;
</style>
