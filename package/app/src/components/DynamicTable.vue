<script setup lang="ts">
import { PropType, ref, computed } from 'vue';
import IconButton from './buttons/preset/IconButton.vue';
import AppPagination from './Pagination.vue';
import { TableColumn, TableOption, TablePagination } from './type';
import { useAppStore } from 'src/stores/app';
import { sort } from 'src/helpers';

const props = defineProps({
  option: {
    type: Object as PropType<Omit<TableOption, 'pagination'>>,
    required: true,
  },
  alignCenter: {
    type: Boolean,
    default: true,
  },
  hideBottom: {
    type: Boolean,
    default: false,
  },
  filter: {
    type: String,
    default: undefined,
  },
  virtualScroll: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object as PropType<TablePagination>,
    default: undefined,
  },
  selected: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits<{
  (
    event: 'virtual-scroll',
    detail: {
      index: number;
      from: number;
      to: number;
      direction: 'increase' | 'decrease';
    }
  ): void;
  (event: 'row-click', row: any): void;
  (event: 'update:selected', data: readonly any[]): void;
  (event: 'update:pagination', value: TablePagination): void;
}>();

const appStore = useAppStore();
const descending = ref(props.option.initialSort?.descending || false);
const sortBy = ref<TableColumn<any> | null>(
  props.option.columns?.find(
    (col) => props.option.initialSort?.key === col.name
  ) || null
);
const sortedData = computed(() => {
  const col = sortBy.value;
  const _sort = sortBy.value?.sort;
  const data = props.option.data;
  if (col && _sort) {
    let values = data.map((v: any, index) => ({
      index,
      value: getValue(v, col),
    }));
    if (typeof _sort === 'boolean') {
      values = sort(values, {
        selector: 'value',
        descending: descending.value,
      });
    } else if (typeof _sort === 'function') {
      values.sort(
        (a: any, b: any) => _sort(a, b) * (descending.value ? -1 : 1)
      );
    }
    return values.map(({ index }) => data[index]);
  }
  return data;
});
const rowsPerpage = computed(() =>
  props.pagination?.rowsPerPage === undefined
    ? 50
    : props.pagination?.rowsPerPage
);

const selectedRows = ref<any[]>([]);

function getValue(data: any, col: TableColumn<any>): any {
  let v = '';
  if (typeof col.field === 'function') v = col.field(data);
  else v = data[col.field];

  if (col.format) v = col.format(v);
  return v;
}

function getRowIsLoading(data: any): boolean {
  const { rowId } = props.option;
  let id: string | null = null;
  if (typeof rowId === 'function') id = rowId(data);
  else id = rowId ? data[rowId as string] : null;
  return !!id && appStore.loadingQueue.some((queue) => queue.id === id);
}

function toggleSorting(col: TableColumn<any>) {
  if (props.pagination?.sortBy === col.name) {
    emits('update:pagination', {
      ...props.pagination,
      descending: !props.pagination?.descending,
      sortBy: col.name,
    });
  } else {
    emits('update:pagination', {
      ...props.pagination,
      descending: false,
      sortBy: col.name,
    });
  }
}

function changePage(page: number) {
  emits('update:pagination', {
    ...props.pagination,
    page,
  });
}

function getSelectedString() {
  return selectedRows.value.length
    ? `${selectedRows.value.length} of ${props.option.data.length} selected`
    : '';
}

function onRowClick(v: unknown) {
  emits('row-click', v);
}

// function onSelect(v) {
//   emits('', v);
// }
</script>

<template>
  <div class="relative-position app-table full-width">
    <q-table
      ref="tableRef"
      row-key="name"
      :pagination="pagination"
      @update:pagination="(v) => emits('update:pagination', v)"
      :rows="props.option.data"
      :hide-bottom="hideBottom || !rowsPerpage"
      :filter="filter"
      :virtual-scroll="virtualScroll"
      :loading="loading"
      flat
      class="fit"
      binary-state-sort
      @row-click="onRowClick"
      @virtual-scroll="(ev: any) => emits('virtual-scroll', ev)"
      :selected-rows-label="getSelectedString"
      :selection="option.multiSelection ? 'multiple' : 'none'"
      :selected="selected"
      @update:selected="(v) => emits('update:selected', v)"
    >
      <template #header="props">
        <q-tr :props="props">
          <q-th align="left" v-if="option.multiSelection && option.data.length">
            <q-checkbox
              v-if="option.data.length"
              v-model="props.selected"
              dense
              size="sm"
            />
          </q-th>

          <q-th
            v-for="col in option.columns.filter((c) => !c.hide)"
            :key="col.name"
            :class="{
              showSort: col.name === pagination?.sortBy,
            }"
            :style="col.option?.style"
            class="t-body-bold"
          >
            <slot :name="`header-${col.name}`" :column="col">
              <div
                class="relative-position"
                :style="{
                  paddingRight: col.sort ? '26px' : '0px',
                }"
              >
                <div
                  class="col"
                  :class="{
                    'text-left': !col.align || col.align === 'left',
                    'text-center': col.align === 'center',
                    'text-right': col.align === 'right',
                  }"
                >
                  {{ col.label }}
                </div>
                <div class="row" style="position: absolute; right: 0; top: 0">
                  <icon-button
                    v-if="col.sort"
                    icon="unfold_more"
                    class="q-ml-xs sort-btn"
                    :color="
                      col.name === pagination?.sortBy
                        ? 'primary'
                        : 'black-transparent'
                    "
                    @click="() => toggleSorting(col)"
                  />
                </div>
              </div>
            </slot>
          </q-th>
        </q-tr>
      </template>

      <template #loading>
        <q-inner-loading
          style="height: 200px"
          showing
          label="Loading data"
          color="primary"
        />
      </template>

      <template #body="v">
        <q-tr
          :class="
            getRowIsLoading(v.row)
              ? 'text-disabled no-pointer-events'
              : 'cursor-pointer'
          "
          @click="() => onRowClick(v.row)"
        >
          <q-td
            v-if="option.multiSelection"
            :class="alignCenter ? '' : 'full-height cell-padding'"
          >
            <q-checkbox
              v-if="sortedData.length"
              v-model="v.selected"
              dense
              size="sm"
            />
          </q-td>
          <template
            v-for="col in option.columns.filter((c) => !c.hide)"
            :key="col.name"
          >
            <slot :name="col.name" :row="v.row" :value="getValue(v.row, col)">
              <q-td
                :class="[
                  col.option?.class,
                  { 'text-left': !col.align || col.align === 'left' },
                  { 'text-center': col.align === 'center' },
                  { 'text-right': col.align === 'right' },
                ]"
                :style="col.option?.style"
              >
                <div
                  v-if="Array.isArray(getValue(v.row, col))"
                  :class="alignCenter ? '' : 'full-height cell-padding'"
                  style="padding: 5px 0"
                >
                  <div v-for="(x, i) in getValue(v.row, col)" :key="i">
                    {{ x }}
                  </div>
                </div>
                <template v-else>
                  <div :class="alignCenter ? '' : 'full-height cell-padding'">
                    {{ getValue(v.row, col) }}
                  </div>
                </template>
              </q-td>
            </slot>
          </template>
        </q-tr>
      </template>

      <template #no-data>
        <div>No record</div>
      </template>

      <template #pagination="{ pagesNumber }">
        <app-pagination
          :model-value="pagination?.page || 1"
          :total-pages="pagesNumber"
          @update:model-value="changePage"
        />
      </template>
    </q-table>
  </div>
</template>

<style lang="sass">
.no-data-cell:hover:before
  display: none

.app-table-pagination-input
  width: 40px

  .q-field__control
    height: 32px

.app-table
  th
    .sort-btn
      display: none

    &.showSort, &:hover
      .sort-btn
        display: block
  td
    div
      white-space: pre-wrap
</style>
