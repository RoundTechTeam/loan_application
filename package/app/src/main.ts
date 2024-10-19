import { createApp, App } from 'vue';
import Router from './router';
import MainApp from './App.vue';
import Splash from './pages/Splash.vue';

// !!! Quasar dependencies
import {
  Quasar,
  Dialog,
  Meta,
  Notify,
  Loading,
  Platform,
  Screen,
} from 'quasar';
// Quasar icon sets
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';
import '@quasar/extras/mdi-v5/mdi-v5.css';
import '@quasar/extras/ionicons-v4/ionicons-v4.css';
// Quasar css
import 'quasar/src/css/index.sass';

// Import pinia
import { createPinia } from 'pinia';

// Import DayJS
import dayjs, { extend } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import objectSupport from 'dayjs/plugin/objectSupport';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// init global pinia store
const pinia = createPinia();

// create splash screen
const splash = createApp(Splash);
splash.mount('#app');

/// !!! init plugins and libraries below to mount Splash asap

// init dayjs
extend(isBetween);
extend(isSameOrBefore);
extend(updateLocale);
extend(utc);
extend(timezone);
extend(objectSupport);
extend(localizedFormat);
dayjs.updateLocale('en', {
  weekStart: 1,
});

async function init() {}

init().then(async () => {
  const app = await registerVue();
  splash.unmount();
  app.mount('#app');
});

async function registerVue(): Promise<App> {
  const app = createApp(MainApp);
  app.use(pinia);
  try {
    console.log('initApp');
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    // register quasar plugin
    app.use(Quasar, {
      plugins: {
        Dialog,
        Meta,
        Notify,
        Loading,
        Platform,
        Screen,
      },
    });

    // register router
    app.use(Router);
    // eslint-disable-next-line no-unsafe-finally
    return app;
  }
}
