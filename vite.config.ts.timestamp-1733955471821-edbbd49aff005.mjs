// vite.config.ts
import path from "path";
import react from "file:///D:/alex/Desktop/stronk/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///D:/alex/Desktop/stronk/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///D:/alex/Desktop/stronk/node_modules/vite-plugin-pwa/dist/index.js";

// manifest.ts
var StronkManifest = {
  registerType: "autoUpdate",
  devOptions: { enabled: true },
  injectRegister: "auto",
  manifest: {
    name: "Stronk",
    short_name: "Stronk",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    description: "A simple and convenient application that helps you track your fitness progress and stay on top of your goals.",
    icons: [
      {
        "src": "icons/icon-72x72.png",
        "sizes": "72x72",
        "type": "image/png"
      },
      {
        "src": "icons/icon-96x96.png",
        "sizes": "96x96",
        "type": "image/png"
      },
      {
        "src": "icons/icon-128x128.png",
        "sizes": "128x128",
        "type": "image/png"
      },
      {
        "src": "icons/icon-144x144.png",
        "sizes": "144x144",
        "type": "image/png"
      },
      {
        "src": "icons/icon-152x152.png",
        "sizes": "152x152",
        "type": "image/png"
      },
      {
        "src": "icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "icons/icon-384x384.png",
        "sizes": "384x384",
        "type": "image/png"
      },
      {
        "src": "icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "D:\\alex\\Desktop\\stronk";
var vite_config_default = defineConfig({
  plugins: [react(), VitePWA(StronkManifest)],
  server: {
    host: true,
    port: 3e3
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhbGV4XFxcXERlc2t0b3BcXFxcc3Ryb25rXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxhbGV4XFxcXERlc2t0b3BcXFxcc3Ryb25rXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9hbGV4L0Rlc2t0b3Avc3Ryb25rL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xuaW1wb3J0IHsgU3Ryb25rTWFuaWZlc3QgfSBmcm9tIFwiLi9tYW5pZmVzdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgVml0ZVBXQShTdHJvbmtNYW5pZmVzdCldLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiB0cnVlLFxuICAgIHBvcnQ6IDMwMDAsXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGFsZXhcXFxcRGVza3RvcFxcXFxzdHJvbmtcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFsZXhcXFxcRGVza3RvcFxcXFxzdHJvbmtcXFxcbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FsZXgvRGVza3RvcC9zdHJvbmsvbWFuaWZlc3QudHNcIjtcclxuZXhwb3J0IGNvbnN0IFN0cm9ua01hbmlmZXN0ID0ge1xyXG4gIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIgYXMgY29uc3QsXHJcbiAgZGV2T3B0aW9uczogeyBlbmFibGVkOiB0cnVlIH0sXHJcbiAgaW5qZWN0UmVnaXN0ZXI6ICdhdXRvJyBhcyBjb25zdCxcclxuICBtYW5pZmVzdDoge1xyXG4gICAgbmFtZTogXCJTdHJvbmtcIixcclxuICAgIHNob3J0X25hbWU6IFwiU3Ryb25rXCIsXHJcbiAgICBzdGFydF91cmw6IFwiL1wiLFxyXG4gICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIgYXMgY29uc3QsXHJcbiAgICBiYWNrZ3JvdW5kX2NvbG9yOiBcIiNmZmZmZmZcIixcclxuICAgIHRoZW1lX2NvbG9yOiBcIiNmZmZmZmZcIixcclxuICAgIGRlc2NyaXB0aW9uOiBcIkEgc2ltcGxlIGFuZCBjb252ZW5pZW50IGFwcGxpY2F0aW9uIHRoYXQgaGVscHMgeW91IHRyYWNrIHlvdXIgZml0bmVzcyBwcm9ncmVzcyBhbmQgc3RheSBvbiB0b3Agb2YgeW91ciBnb2Fscy5cIixcclxuICAgIGljb25zOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBcInNyY1wiOiBcImljb25zL2ljb24tNzJ4NzIucG5nXCIsXHJcbiAgICAgICAgXCJzaXplc1wiOiBcIjcyeDcyXCIsXHJcbiAgICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFwic3JjXCI6IFwiaWNvbnMvaWNvbi05Nng5Ni5wbmdcIixcclxuICAgICAgICBcInNpemVzXCI6IFwiOTZ4OTZcIixcclxuICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzcmNcIjogXCJpY29ucy9pY29uLTEyOHgxMjgucG5nXCIsXHJcbiAgICAgICAgXCJzaXplc1wiOiBcIjEyOHgxMjhcIixcclxuICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzcmNcIjogXCJpY29ucy9pY29uLTE0NHgxNDQucG5nXCIsXHJcbiAgICAgICAgXCJzaXplc1wiOiBcIjE0NHgxNDRcIixcclxuICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzcmNcIjogXCJpY29ucy9pY29uLTE1MngxNTIucG5nXCIsXHJcbiAgICAgICAgXCJzaXplc1wiOiBcIjE1MngxNTJcIixcclxuICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzcmNcIjogXCJpY29ucy9pY29uLTE5MngxOTIucG5nXCIsXHJcbiAgICAgICAgXCJzaXplc1wiOiBcIjE5MngxOTJcIixcclxuICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzcmNcIjogXCJpY29ucy9pY29uLTM4NHgzODQucG5nXCIsXHJcbiAgICAgICAgXCJzaXplc1wiOiBcIjM4NHgzODRcIixcclxuICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJzcmNcIjogXCJpY29ucy9pY29uLTUxMng1MTIucG5nXCIsXHJcbiAgICAgICAgXCJzaXplc1wiOiBcIjUxMng1MTJcIixcclxuICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9ICBcclxuICAgIF0sXHJcbiAgfSxcclxufTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQTRQLE9BQU8sVUFBVTtBQUM3USxPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxlQUFlOzs7QUNGakIsSUFBTSxpQkFBaUI7QUFBQSxFQUM1QixjQUFjO0FBQUEsRUFDZCxZQUFZLEVBQUUsU0FBUyxLQUFLO0FBQUEsRUFDNUIsZ0JBQWdCO0FBQUEsRUFDaEIsVUFBVTtBQUFBLElBQ1IsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osV0FBVztBQUFBLElBQ1gsU0FBUztBQUFBLElBQ1Qsa0JBQWtCO0FBQUEsSUFDbEIsYUFBYTtBQUFBLElBQ2IsYUFBYTtBQUFBLElBQ2IsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE9BQU87QUFBQSxRQUNQLFNBQVM7QUFBQSxRQUNULFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQ1AsU0FBUztBQUFBLFFBQ1QsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxPQUFPO0FBQUEsUUFDUCxTQUFTO0FBQUEsUUFDVCxRQUFRO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE9BQU87QUFBQSxRQUNQLFNBQVM7QUFBQSxRQUNULFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQ1AsU0FBUztBQUFBLFFBQ1QsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxPQUFPO0FBQUEsUUFDUCxTQUFTO0FBQUEsUUFDVCxRQUFRO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE9BQU87QUFBQSxRQUNQLFNBQVM7QUFBQSxRQUNULFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLFFBQ0UsT0FBTztBQUFBLFFBQ1AsU0FBUztBQUFBLFFBQ1QsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOzs7QUR4REEsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxRQUFRLGNBQWMsQ0FBQztBQUFBLEVBQzFDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
