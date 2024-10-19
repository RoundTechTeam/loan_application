<script setup lang="ts">
import {
  CountryCode as CountryCodeFromLibPhone,
  getCountryCallingCode,
} from 'libphonenumber-js';
import { onMounted, PropType, ref } from 'vue';
import CountryFlag from 'vue-country-flag-next';
import { Country } from '~libs/entities';

const props = defineProps({
  initialValue: {
    type: Object as PropType<CountryCodeFromLibPhone>,
    default: null,
  },
  modelValue: {
    type: Object as PropType<Country>,
    required: true,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  flat: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '134px',
  },
});

const emits = defineEmits<{ (e: 'update:modelValue', value: Country) }>();

const enumCountry = ['MY', 'SG'];

const initialStartUp = ref(true);

//TBC Country Code
const countries = enumCountry.map((code) => ({
  label: '',
  value: code,
  code: code as CountryCodeFromLibPhone,
  extension: getCountryCallingCode(code as CountryCodeFromLibPhone),
}));

const filteredCountries = ref<Country[]>(countries);

function filterSelection(val: string) {
  if (initialStartUp.value) {
    val = '';
    filteredCountries.value = countries;
    return;
  } else {
    filteredCountries.value = countries.filter(
      (v) => v.extension.indexOf(val) > -1
    );
  }
}

function selectCountry(v: Country) {
  initialStartUp.value = true;
  // const selected = filteredCountries.value.find(
  //   (country) => country.code === v
  // );
  //if (selected) emits('update:modelValue', selected);

  emits('update:modelValue', v);
}

onMounted(() => {
  if (props.initialValue) {
    const selected = countries.find(
      (country) => country.code === props.initialValue
    );
    if (selected) emits('update:modelValue', selected);
  }
});
</script>

<template>
  <q-select
    :model-value="modelValue.extension"
    :options="filteredCountries"
    class="q-pa-none country-selector"
    color="transparent"
    dense
    filled
    :disable="disable"
    use-input
    fill-input
    :style="{ width: width }"
    @popup-show="initialStartUp = false"
    @popup-hide="initialStartUp = true"
    @update:model-value="selectCountry"
    @input-value="filterSelection"
  >
    <template #selected>
      <div class="row items-center no-wrap">
        <div>
          <country-flag :country="modelValue.code" :size="`normal`" />
        </div>

        <!-- <div class="q-ml-sm text-center">
          {{ `+${modelValue.extension}` }}
        </div> -->
      </div>
    </template>

    <template #no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>

    <template #option="{ opt, itemProps }">
      <!-- <q-item v-close-popup clickable @click="selectCountry(opt.code)">
        <div class="row items-center no-wrap">
          <country-flag
            :country="opt.code"
            size="normal"
            class="custom-flag"
            style="margin-top: -8px"
          />

          <div class="q-ml-sm text-center">
            {{ `+${opt.extension}` }}
          </div>
        </div>
      </q-item> -->
      <q-item class="row items-center" v-bind="(itemProps as any)">
        <country-flag
          :country="opt.code"
          size="normal"
          class="custom-flag"
          style="margin-top: -8px"
        />
        <div class="q-ml-sm text-center">
          {{ `+${opt.extension}` }}
        </div>
      </q-item>
    </template>
  </q-select>
</template>

<style lang="sass" scoped>
.custom-flag
  display: flex
  align-items: center

.country-selector
  .q-field__native > div
    height: 29px
    @extend .custom-flag
</style>
