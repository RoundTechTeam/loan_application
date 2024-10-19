import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import vue from '@vitejs/plugin-vue';
import { DotenvParseOutput, config } from 'dotenv';
import * as path from 'path';
import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import topLevelAwait from 'vite-plugin-top-level-await';
import packageJson from './package.json';

function getEnv(
  mode: 'production' | 'development' | string
): DotenvParseOutput | undefined {
  const envFile = mode === 'production' ? 'build-prod.env' : 'build-dev.env';
  const env = config({ path: `./${envFile}` });
  if (!env || env.error) {
    throw new Error(`fail to load ${envFile}  .env`);
  }

  return env.parsed || undefined;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = getEnv(mode);
  console.log('Running Env', env);
  return {
    server: {
      port: 9000,
      strictPort: true,
    },
    plugins: [
      ViteEjsPlugin((viteConfig) => {
        const env = viteConfig.define?.['process.env'];
        if (!env) return {};
        return JSON.parse(env);
      }),
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: '__tla',
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: (i) => `__tla_${i}`,
      }),
      vue({
        template: { transformAssetUrls },
      }),
      quasar({
        sassVariables: 'src/styles/quasar-variables.sass',
      }),
    ],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
        pages: path.resolve(__dirname, './src/pages'),
        layouts: path.resolve(__dirname, './src/layouts'),
        components: path.resolve(__dirname, './src/components'),
        '~api': path.resolve(__dirname, '../backend/apps/api/src'),
        '~libs': path.resolve(__dirname, '../backend/libs'),
      },
    },
    build: {
      outDir: 'dist/spa',
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
    define: {
      'process.env': JSON.stringify({
        ...env,
        APP_MODE: mode,
        APP_VERSION: packageJson.version,
        APP_TITLE: packageJson.productName,
        APP_DESCRIPTION: packageJson.description,
      }),
    },
  };
});
