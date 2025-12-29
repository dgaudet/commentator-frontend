import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load environment variables that start with VITE_
  const env = loadEnv(mode, process.cwd())

  // Map the VITE_* variables to keys without the prefix.
  // this allows us to use process.env.VARIABLE_NAME in the code eventhough vite doesn't support process.env directly.
  const processEnv = Object.keys(env)
    .filter((key) => key.startsWith('VITE_'))
    .reduce((acc, key) => {
      // Remove the "VITE_" prefix and expose the variable
      const newKey = key.replace(/^VITE_/, '')
      acc[`process.env.${newKey}`] = JSON.stringify(env[key])
      return acc
    }, {} as Record<string, string>)

  // Determine base path based on environment
  // Production (GitHub Pages): /commentator-frontend/
  // Development (local): /
  const isProduction = mode === 'production'
  const base = isProduction ? '/commentator-frontend/' : '/'

  return {
    base,
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      allowedHosts: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    define: processEnv,
  }
})
