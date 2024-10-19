<script setup lang="ts">
import { settingIcon } from 'src/assets/icons';
import { MoreActionOption } from 'src/components/type';
import { notify } from 'src/plugins';
import { PropType } from 'vue';
import IconButton from './IconButton.vue';

defineProps({
  actions: {
    type: Array as PropType<MoreActionOption[]>,
    default: () => [],
  },
});

function selectAction(action: MoreActionOption) {
  if (!action.disable) {
    action.callback();
  } else if (typeof action.disable === 'string') {
    notify.error(action.disable);
  }
}
</script>

<template>
  <icon-button :icon="settingIcon" padding="8px">
    <q-menu auto-close style="overflow-x: hidden">
      <q-list style="min-width: 160px">
        <q-item
          v-for="(action, index) in actions.filter((act) => !act.hide)"
          :key="index"
          :clickable="!action.disable"
          @click="() => selectAction(action)"
        >
          <q-item-section :class="action.class">
            <q-item-label
              :class="{
                'text-disabled': action.disable,
              }"
            >
              {{ action.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </icon-button>
</template>
