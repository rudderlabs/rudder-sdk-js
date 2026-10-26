import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      // index.html loads the SDK from npm; cdn.html loads it from the CDN
      input: ['index.html', 'cdn.html'],
    },
  },
});
