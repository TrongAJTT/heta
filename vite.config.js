import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-manifest",
      closeBundle() {
        // Copy manifest.json to dist
        copyFileSync(
          resolve(__dirname, "public/manifest.json"),
          resolve(__dirname, "dist/manifest.json")
        );
        // Copy icons to dist
        const icons = ["icon16.png", "icon48.png", "icon128.png"];
        icons.forEach((icon) => {
          copyFileSync(
            resolve(__dirname, `public/${icon}`),
            resolve(__dirname, `dist/${icon}`)
          );
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
