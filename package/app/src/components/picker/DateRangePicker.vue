<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';
import { PropType, computed } from 'vue';

export type DateRange = [Date, Date];
export type PresetDate = {
  label: string;
  value: DateRange;
}[];

defineProps({
  disable: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array as PropType<Date[] | null>,
    validator: (dates: Date[]) => {
      if (dates.length !== 2) {
        return false;
      }
      return true;
    },
    required: true,
  },
  preset: {
    type: Array as PropType<PresetDate>,
    default: () => [
      {
        label: 'Today',
        value: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
      },
      {
        label: 'Yesterday',
        value: [
          dayjs().subtract(1, 'day').startOf('day').toDate(),
          dayjs().subtract(1, 'day').endOf('day').toDate(),
        ],
      },
      {
        label: 'Last 3 days',
        value: [
          dayjs().subtract(3, 'days').startOf('day').toDate(),
          dayjs().subtract(1, 'days').endOf('day').toDate(),
        ],
      },
      {
        label: 'Last 7 days',
        value: [
          dayjs().subtract(7, 'days').startOf('day').toDate(),
          dayjs().subtract(1, 'days').endOf('day').toDate(),
        ],
      },
    ],
  },
  maxDate: {
    type: Date,
    default: null,
  },
  timePicker: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: Date[]);
}>();

const hoursArray = computed(() => {
  const arr: { label: string; value: any }[] = [];
  for (let i = 0; i < 24; i++) {
    arr.push({ label: i < 10 ? `0${i}` : `${i}`, value: i });
  }
  return arr;
});

const minutesArray = computed(() => {
  const arr: { label: string; value: any }[] = [];
  for (let i = 0; i < 60; i++) {
    arr.push({ label: i < 10 ? `0${i}` : `${i}`, value: i });
  }
  return arr;
});
</script>

<template>
  <VueDatePicker
    style="width: 350px"
    :model-value="modelValue"
    @update:model-value="(v) => emit('update:modelValue', v)"
    range
    :disabled="disable"
    :partial-range="false"
    :preset-dates="preset"
    :max-date="maxDate"
  >
    <template v-if="timePicker" #time-picker="{ time, updateTime }">
      <div class="row items-center justify-between q-px-xs">
        <div class="row items-center justify-center">
          <select
            class="select-input"
            :value="time.hours[0]"
            @change="(e) => updateTime([(e as any).target.value])"
          >
            <option v-for="h in hoursArray" :key="h.value" :value="h.value">
              {{ h.label }}
            </option>
          </select>
          <select
            class="select-input"
            :value="time.minutes[0]"
            @change="(e) => updateTime([(e as any).target.value], false)"
          >
            <option v-for="m in minutesArray" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>
        </div>
        <div>to</div>
        <div class="row items-center justify-center">
          <select
            class="select-input"
            :value="time.hours[1]"
            @change="(e) => updateTime([null, (e as any).target.value])"
          >
            <option v-for="h in hoursArray" :key="h.value" :value="h.value">
              {{ h.label }}
            </option>
          </select>
          <select
            class="select-input"
            :value="time.minutes[1]"
            @change="(e) => updateTime([null,(e as any).target.value], false)"
          >
            <option v-for="m in minutesArray" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>
        </div>
      </div>
    </template>
  </VueDatePicker>
</template>
<style>
.center {
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
}

.dp__theme_light {
  --dp-background-color: #ffffff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #f16c22;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #ddd;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
}

.select-input {
  margin: 5px 3px;
  padding: 2px;
  width: 50px;
  border-radius: 4px;
  border-color: var(--dp-border-color);
  outline: none;
  -webkit-appearance: menulist;
}
</style>
