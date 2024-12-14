import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa";
import { StronkManifest } from "./manifest";
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), VitePWA(StronkManifest), tsconfigPaths()],
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})