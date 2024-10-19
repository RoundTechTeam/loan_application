<script setup lang="ts">
import { ref, PropType, computed } from 'vue';
import GlobalDialog from './Dialog.vue';
import PrimaryButton from '../buttons/PrimaryButton.vue';
import SearchInput from '../form/SearchInput.vue';
import GroupPicker, { Group } from '../picker/GroupPicker.vue';
import { useDialog, useResponsive, useSearch } from 'src/composable';

const props = defineProps({
  initialValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  groups: {
    type: Array as PropType<Group[]>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
});

const { searchKey, filter } = useSearch();
const { isMobile } = useResponsive();
const { dialogRef, emitData } = useDialog();

const selectedValue = ref<string[]>([...props.initialValue]);

const filteredGroups = computed(() => {
  const key = searchKey.value.trim().toLowerCase();
  const res = !key
    ? props.groups
    : props.groups.map((c) => ({
        ...c,
        options: c.options.filter((p) => filter([c.label, p.label])),
      }));
  return res.filter((v) => v.options.length > 0);
});
</script>

<template>
  <global-dialog
    ref="dialogRef"
    :title="title"
    @submit="emitData(selectedValue)"
  >
    <div :class="{ 'column fit': isMobile }">
      <div class="q-pa-lg">
        <search-input v-model="searchKey" autofocus />
      </div>
      <group-picker
        v-model="selectedValue"
        :groups="filteredGroups"
        :multiple="multiple"
        :class="{ col: isMobile }"
        :style="isMobile ? '' : 'max-height: 50vh'"
        class="q-px-lg"
      />
    </div>

    <template #actions>
      <primary-button label="Confirm" type="submit" />
    </template>
  </global-dialog>
</template>
