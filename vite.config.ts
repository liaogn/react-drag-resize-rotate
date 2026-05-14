import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [
      react(),
      isLib &&
        dts({
          include: ['src/core', 'src/react', 'src/index.ts'],
          exclude: ['src/playground/**'],
          bundleTypes: true,
          insertTypesEntry: true,
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    ...(isLib
      ? {
          build: {
            lib: {
              entry: resolve(__dirname, 'src/index.ts'),
              name: 'ReactDragResizeRotate',
              fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.umd.cjs'),
              cssFileName: 'style',
              formats: ['es', 'umd'] as const,
            },
            sourcemap: true,
            rollupOptions: {
              external: ['react', 'react-dom', 'react/jsx-runtime'],
              output: {
                exports: 'named',
                globals: {
                  react: 'React',
                  'react-dom': 'ReactDOM',
                  'react/jsx-runtime': 'jsxRuntime',
                },
              },
            },
          },
        }
      : {
          server: {
            port: 5174,
            open: true,
          },
        }),
  }
})
