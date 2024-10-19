import { Dialog } from 'quasar';
import Confirmation from './components/dialog/Confirmation.vue';
import { randomString } from './helpers';
import { useAppStore } from './stores/app';
import { toast } from 'vue-sonner';
import { Component } from 'vue';

interface ConfirmationData {
  title?: string;
  message?: string;
  buttonText?: string;
}

const prompt = {
  deleteConfirmation(v?: ConfirmationData) {
    return Dialog.create({
      component: Confirmation,
      componentProps: {
        icon: 'fa-solid fa-trash-can',
        color: 'negative',
        title: v?.title,
        message: v?.message,
        confirmText: v?.buttonText,
      },
    });
  },
  warningConfirmation(v?: ConfirmationData) {
    return Dialog.create({
      component: Confirmation,
      componentProps: {
        icon: 'fa-solid fa-circle-exclamation',
        color: 'primary',
        title: v?.title,
        message: v?.message,
        confirmText: v?.buttonText,
      },
    });
  },
};

interface NotifyOptions {
  action?: { label: string; onClick: () => void };
  cancel?: { label: string; onClick: () => void };
  duration?: number;
  description?: string;
  style?: { color: string };
  dismissible?: boolean;
  important?: boolean;
}

const notify = {
  success(message: string | Component, option?: NotifyOptions) {
    toast.success(message, {
      action: option?.action,
      cancel: option?.cancel,
      description: option?.description,
      style: option?.style,
      duration: option?.duration || 5000,
      dismissible: option?.dismissible || true,
      important: option?.important,
    });
  },
  warning(message: string | Component, option?: NotifyOptions) {
    toast.warning(message, {
      action: option?.action,
      cancel: option?.cancel,
      description: option?.description,
      style: option?.style,
      duration: option?.duration || 5000,
      dismissible: option?.dismissible || true,
      closeButton: option?.dismissible || true,
      important: option?.important,
    });
  },
  error(message: string | Component, option?: NotifyOptions) {
    toast.error(message, {
      action: option?.action,
      cancel: option?.cancel,
      description: option?.description,
      style: option?.style,
      duration: option?.duration || 5000,
      dismissible: option?.dismissible || true,
      closeButton: option?.dismissible || true,
      important: option?.important,
    });
  },
  info(message: string | Component, option?: NotifyOptions) {
    toast.info(message, {
      action: option?.action,
      cancel: option?.cancel,
      description: option?.description,
      style: option?.style,
      duration: option?.duration || 5000,
      dismissible: option?.dismissible || true,
      closeButton: option?.dismissible || true,
      important: option?.important,
    });
  },
};

async function toggleLoading<T>(func: () => Promise<T>): Promise<T> {
  const queueId = `${new Date().toISOString()}-${randomString(4)}`;
  const appStore = useAppStore();
  try {
    appStore.addLoadingQueues([
      {
        id: queueId,
        isGlobal: true,
      },
    ]);
    return await func();
  } catch (err) {
    if (err instanceof Error) {
      notify.error(err.message);
    } else {
      notify.error(`${err}`);
    }
    throw err;
  } finally {
    appStore.resolveQueues([queueId]);
  }
}

export { prompt, notify, toggleLoading };
