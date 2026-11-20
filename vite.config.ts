import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom", "react-router", "react-router-dom"] },
  server: {
    fs: { allow: [fileURLToPath(new URL(".", import.meta.url)), fileURLToPath(new URL("./portal-route-sdk", import.meta.url))] },
    port: 5176,
    strictPort: true,
    host: "localhost",
  },
});
