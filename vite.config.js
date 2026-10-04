import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// singleFile bundles everything into one dist/index.html,
// which is what you drag into Netlify. Drop the plugin if you
// would rather deploy normal split assets.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist' },
})
