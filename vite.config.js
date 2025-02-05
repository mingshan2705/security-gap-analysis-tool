import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Removed NodeGlobalsPolyfillPlugin and NodeModulesPolyfillPlugin
// Removed rollup-plugin-node-polyfills

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
