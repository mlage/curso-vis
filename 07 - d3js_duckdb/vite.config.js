import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  publicDir: path.resolve(__dirname, '../00 - data'), // Serve the parent folder as public assets
});