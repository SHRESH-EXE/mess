import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  return {
    // IMPORTANT: Set 'base' for GitHub Pages deployment.
    // Replace '/REPLACE_WITH_REPO_NAME/' with your actual GitHub repository name (e.g., '/my-repo-name/') before running 'npm run deploy' or 'npm run build'.
    // In local development (`npm run dev`), base resolves to '/' for local preview compatibility.
    base: command === 'serve' ? '/' : '/mess/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
