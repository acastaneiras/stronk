import path from "path"
import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    tsconfigPaths()
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./setup-tests.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

})