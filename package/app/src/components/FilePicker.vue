<script setup lang="ts">
import { addIcon, closeIcon, editIcon } from 'src/assets/icons';
import { computed, PropType, ref } from 'vue';

const props = defineProps({
  extensions: {
    type: Array as PropType<string[]>,
    default: undefined,
  },
  fileType: {
    type: String as PropType<'img' | 'file'>,
    default: undefined,
  },
  hasContent: {
    type: Boolean,
    required: true,
  },
  canReplace: {
    type: Boolean,
    default: true,
  },
  canDelete: {
    type: Boolean,
    default: true,
  },
  showHover: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits<{
  (event: 'input', files: File[]): void;
}>();

const filePicker = ref<HTMLInputElement>();
const showOption = ref(false);

const acceptExtensions = computed(() => {
  let result: string | undefined = undefined;
  const { extensions, fileType } = props;
  if (extensions && extensions.length > 0) {
    result = extensions.join(',');
  } else if (fileType) {
    result =
      fileType === 'img'
        ? '.gif,.jpg,.jpeg,.png,.avif,.WebP'
        : '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt';
  }
  return result;
});

function openPicker() {
  if (props.canReplace || !props.hasContent) {
    showOption.value = false;
    filePicker.value?.click();
  }
}

function onSelect(v: Event) {
  const files: FileList =
    (v.target as HTMLInputElement | null)?.files || new FileList();
  if (files.length !== 0) {
    const temp: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) temp.push(file);
    }
    emits('input', temp);
  }
}
</script>

<template>
  <div class="relative-position" style="overflow: hidden">
    <input
      ref="filePicker"
      class="hidden"
      type="file"
      :accept="acceptExtensions"
      onclick="this.value = null"
      @change="onSelect"
    />
    <slot />
    <div
      class="app-file-selector cursor-pointer text-white fit"
      :class="{ show: showHover }"
      @mouseenter="() => (showOption = true)"
      @mouseleave="() => (showOption = false)"
      @click="openPicker"
    >
      <div v-if="showOption" class="fit row items-center justify-center">
        <template v-if="showHover">
          <template v-if="!hasContent">
            <q-icon :name="addIcon" size="sm" />
          </template>

          <template v-else>
            <div v-if="canReplace" class="q-mr-sm" @click.stop="openPicker">
              <q-icon :name="editIcon" size="sm" />
            </div>
            <div v-if="canDelete" @click.stop="emits('input', [])">
              <q-icon :name="closeIcon" size="sm" />
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.app-file-selector
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

  &.show:hover
    background: black
</style>
