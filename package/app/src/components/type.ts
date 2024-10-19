import { DefineComponent } from 'vue';

export type InputModel = string | number | boolean | null;

export enum AUTH_CODE_TYPE {
  ALL = 'ALL',
  ALPHA = 'ALPHA',
  ALPHANUMERIC = 'ALPHANUMERIC',
  NUMERIC = 'NUMERIC',
}

export interface GlobalDialogType extends DefineComponent {
  onDialogOK: (v?: any) => void;
  onDialogCancel: () => void;
  validate: () => Promise<boolean>;
  reset: () => void;
}

export type DateRange = {
  start: Date;
  end: Date;
};

export type DatePickerData = Date | DateRange;

export interface PickerGroup {
  label: string;
  value: string;
  options: PickerOption[];
}

export interface PickerOption {
  label: string;
  value: number | string;
}

export interface CheckboxOption<T = unknown> {
  key?: string;
  label: string;
  value: T;
  disable?: boolean;
  suffix?: {
    text: string;
    class: string;
  };
}

export interface TableColumn<T> {
  name: string;
  label: string;
  field: keyof T | ((v: T) => any);
  sort?:
    | boolean
    | ((
        a: { index: number; value: any },
        b: { index: number; value: any }
      ) => number);
  hide?: boolean;
  format?: (v: any) => string;
  align?: 'left' | 'right' | 'center';
  option?: {
    style?: string;
    class?: string;
  };
}

export interface TablePagination {
  sortBy?: string;
  descending?: boolean;
  page?: number;
  rowsPerPage?: number;
}

export interface TableOption<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  rowId?: keyof T | ((v: T) => string);
  multiSelection?: boolean;
  initialSort?: {
    key: string;
    descending?: boolean;
  };
  pagination?: TablePagination;
}

export interface MoreActionOption {
  label: string;
  class?: string;
  disable?: boolean | string;
  hide?: boolean;
  callback: () => Promise<void>;
}
