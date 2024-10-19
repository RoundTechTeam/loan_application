import { QRejectedEntry } from 'quasar';
import { ref, computed, watch } from 'vue';

export default () =>
  (dto: { extensions: string[]; maxBytes?: number; maxFiles?: number }) => {
    const file = ref<File | null>(null);
    const files = ref<File[]>([]);
    const error = ref<string | null>(null);
    const maxFileSize = (dto.maxBytes || 5000000) * (dto.maxFiles || 1);
    const hint = computed(
      () => `Only ${dto.extensions.join(', ')} files are allowed`
    );
    const accept = computed(() => {
      if (dto.extensions.length === 1) {
        return `.${dto.extensions[0]}`;
      } else {
        return dto.extensions.join(',.');
      }
    });

    function formatBytes(bytes: number): string {
      if (!+bytes) return '0 Bytes';

      const k = 1024;
      const sizes = [
        'Bytes',
        'KiB',
        'MiB',
        'GiB',
        'TiB',
        'PiB',
        'EiB',
        'ZiB',
        'YiB',
      ];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`;
    }

    function handleError(errors: QRejectedEntry[]) {
      if (!errors.length) return;
      const e = errors[0];
      if (e.failedPropValidation === 'accept') {
        error.value = 'Invalid file type';
      } else if (e.failedPropValidation === 'max-file-size') {
        error.value = `File is too large, max size is ${formatBytes(
          dto.maxFiles ? dto.maxBytes! / dto.maxFiles : dto.maxBytes!
        )}`;
      }
    }

    watch([() => file.value, () => files.value], () => {
      if (file.value) error.value = null;
      if (files.value?.length) error.value = null;
    });

    return {
      file,
      files,
      error,
      hint,
      accept,
      maxFileSize,
      maxFiles: dto.maxFiles,
      handleError,
    };
  };
