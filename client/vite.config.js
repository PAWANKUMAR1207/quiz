import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/questions": "http://127.0.0.1:3000",
      "/submit": "http://127.0.0.1:3000",
      "/leaderboard": "http://127.0.0.1:3000",
    },
  },
});
