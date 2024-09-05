<template>
  <input
    required
    v-model="userInfo"
    @input="
      handleInput($event);
      props.v.$touch()
    "
    type="time"
    placeholder=""
    :class="{ invalid: isInvalid() }"
  />
  <i>{{ props.name }}</i>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: null | string
  name: string
  v: {
    $invalid: boolean
    $dirty: boolean
    $touch: Function
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const userInfo = ref(props.modelValue)

const handleInput = (event: any) => {
  if (!event.target) return
  userInfo.value = event.target.value
  emit('update:modelValue', event.target.value)
}

const isInvalid = () => {
  return props.v.$invalid && props.v.$dirty && !userInfo.value
}

watch(
  () => props.modelValue,
  () => {
    userInfo.value = props.modelValue
  }
)
</script>
<style scoped lang="scss">
@use '@/assets/styles/index';
@include index.input-text;
</style>
