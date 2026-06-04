import { defineConfig, loadEnv, type PluginOption, type ServerOptions } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const https: ServerOptions['https'] = (() => {
    try {
      return {
        key: fs.readFileSync('./.cert/key.pem'),
        cert: fs.readFileSync('./.cert/cert.pem'),
      };
    } catch {
      return undefined;
    }
  })();

  return {
    plugins: [react()] as PluginOption[],
    resolve: {
      alias: {
        api: path.resolve(__dirname, 'src/api'),
        assets: path.resolve(__dirname, 'src/assets'),
        components: path.resolve(__dirname, 'src/components'),
        contexts: path.resolve(__dirname, 'src/contexts'),
        hooks: path.resolve(__dirname, 'src/hooks'),
        i18n: path.resolve(__dirname, 'src/i18n'),
        layout: path.resolve(__dirname, 'src/layout'),
        pages: path.resolve(__dirname, 'src/pages'),
        routes: path.resolve(__dirname, 'src/routes'),
        sections: path.resolve(__dirname, 'src/sections'),
        services: path.resolve(__dirname, 'src/services'),
        store: path.resolve(__dirname, 'src/store'),
        themes: path.resolve(__dirname, 'src/themes'),
        types: path.resolve(__dirname, 'src/types'),
        utils: path.resolve(__dirname, 'src/utils'),
        runtime: path.resolve(__dirname, 'src/runtime'),
        plugins: path.resolve(__dirname, 'src/plugins'),
      },
    },
    server: {
      port: 2210,
      https,
      open: true,
    },
    build: {
      outDir: 'build',
      sourcemap: env.VITE_SOURCEMAP === 'true',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor';
              }
              if (id.includes('@mui')) {
                return 'mui';
              }
              return 'vendor';
            }
          },
        },
      },
    },
  };
});


