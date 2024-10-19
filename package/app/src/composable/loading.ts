import { randomString } from 'src/helpers';
import { useAppStore } from 'src/stores/app';
import { Ref, ref } from 'vue';
import { toast } from 'vue-sonner';

async function start<T>(
  fn: () => Promise<T>,
  config?: {
    message?: string;
    description?: string;
    onSuccess?: (resp: T) => Promise<string | undefined> | string | undefined;
    onError?: (err: unknown) => Promise<string> | string;
    onComplete?: () => Promise<void> | void;
    isGlobal?: boolean;
    customId?: string | string[];
  }
) {
  let resolveIds: string[] = [];
  if (!config || !config.customId)
    resolveIds.push(`${new Date().toISOString()}_${randomString(6)}`);
  else if (typeof config.customId === 'string')
    resolveIds.push(config.customId);
  else resolveIds = config.customId;
  const appStore = useAppStore();
  appStore.addLoadingQueues(
    resolveIds.map((id) => ({
      id,
      isGlobal: config?.isGlobal || false,
    }))
  );

  let successMessage;
  let errorMessage;

  return new Promise<T>((resolve, reject) => {
    async function execute() {
      try {
        const resp = await fn();
        successMessage = await config?.onSuccess?.(resp);
        resolve(resp);
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : `${err}`;
        if (config?.onError) {
          errorMessage = await config.onError(errMessage);
        } else {
          errorMessage = errMessage;
        }
        reject(err);
        throw err;
      } finally {
        appStore.resolveQueues(resolveIds);
        config?.onComplete?.();
      }
    }

    if (!config?.message) {
      execute();
    } else {
      toast.promise(async () => await execute(), {
        loading: config?.message || 'Loading...',
        description: config?.description,
        success: () => successMessage || 'Completed',
        error: () => errorMessage,
        duration: 5000,
        dismissible: true,
        closeButton: true,
      });
    }
  });
}

export default () => {
  const loading = ref(false);
  const loaded = ref(false);

  return {
    loading,
    loaded,
    global: async <T>(
      fn: () => Promise<T>,
      config?: {
        onSuccess?: (resp: T) => Promise<void> | void;
        successMessage?: string;
      }
    ) => {
      return await start<T>(fn, {
        isGlobal: true,
        onSuccess: async (resp) => {
          await config?.onSuccess?.(resp);
          if (config?.successMessage) return config?.successMessage;
        },
      });
    },
    toast: async <T>(
      fn: () => Promise<T>,
      config?: {
        customId?: string | string[];
        isLoading?: Ref<boolean>;
        message?: string;
        successMessage?: string;
      }
    ) => {
      return await start(
        async () => {
          if (config?.isLoading) config.isLoading.value = true;
          const resp = await fn();
          return resp;
        },
        {
          message: config?.message,
          onSuccess: () => config?.successMessage,
          onError: (err) => `${err}` || 'Error',
          onComplete: () => {
            if (config?.isLoading) config.isLoading.value = false;
          },
          customId: config?.customId,
        }
      );
    },
    run: async <T>(
      fn: () => Promise<T>,
      config?: {
        isLoading?: Ref<boolean>;
        successMessage?: string;
        customId?: string | string[];
      }
    ) => {
      return await start(
        async () => {
          if (config?.isLoading) config.isLoading.value = true;
          return await fn();
        },
        {
          onComplete: () => {
            if (config && config.isLoading) config.isLoading.value = false;
          },
          customId: config?.customId,
        }
      );
    },
  };
};
