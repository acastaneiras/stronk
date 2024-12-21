import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import { StronkManifest } from "./manifest";

export default defineConfig(() => {
  return {
    plugins: [react(), VitePWA(StronkManifest), tsconfigPaths()],
    server: {
      host: true,
      port: 5173,
    },
    preview: {
      port: 1111,
    },
    base: "/stronk/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    }
  }
})