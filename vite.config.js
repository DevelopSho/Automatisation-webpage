import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Můžete tento port změnit podle své preference
  },
  resolve: {
    alias: {
      'firebase/app': 'firebase/app',
      'firebase/firestore': 'firebase/firestore',
      'firebase/database': 'firebase/database',
      // Další Firebase moduly můžete přidat podle potřeby
    },
  },
  
});

