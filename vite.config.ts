import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa";
import { StronkManifest } from "./manifest";

export default defineConfig({
  plugins: [react(), VitePWA(StronkManifest)],
  /*server: {
    host: true,
    port: 3000,
  },*/
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
