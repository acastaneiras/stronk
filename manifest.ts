
export const StronkManifest = {
  registerType: "autoUpdate" as const,
  devOptions: { enabled: true },
  injectRegister: 'auto' as const,
  base: "/stronk/",
  scope: "/stronk/",
  manifest: {
    name: "Stronk",
    short_name: "Stronk",
    start_url: "/stronk/",
    display: "standalone" as const,
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
    ],
  },
};