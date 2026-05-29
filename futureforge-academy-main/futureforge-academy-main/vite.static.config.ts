import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  appType: "spa",
  base: "/",
  build: {
    cssCodeSplit: true,
    emptyOutDir: true,
    outDir: "../dist/render-static",
    reportCompressedSize: true,
    sourcemap: false,
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["motion"],
          scroll: ["gsap", "lenis"],
          three: ["three"],
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  plugins: [react(), tailwindcss(), tsConfigPaths()],
  publicDir: "../public",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: "render",
});
