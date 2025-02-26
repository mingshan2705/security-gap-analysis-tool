import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // Ensures build output is in /dist
    emptyOutDir: true, // Clears the old build before generating a new one
  },
  server: {
    host: "0.0.0.0", // Allows external access
    port: 3000,
    strictPort: true,
  },
});
