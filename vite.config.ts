import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

// renCal provides these at runtime, so the plugin shares the app's React,
// Temporal and plugin API instead of bundling its own.
const HOST_MODULES = ["react", "react/jsx-runtime", "@js-temporal/polyfill", "@rencal/plugin-api"]

export default defineConfig({
  plugins: [tailwindcss()],
  esbuild: { jsx: "automatic" },
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "board.js",
      cssFileName: "board",
    },
    rollupOptions: { external: HOST_MODULES },
    // Committed so renCal can install the plugin straight from the repository.
    minify: false,
  },
})
