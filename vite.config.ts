import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: { tsconfigPaths: true },
  // Discover lazy shader entries before the React runtime is prebundled.
  optimizeDeps: { include: ["shaders/react", "shaders/std"] },
  plugins: [
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: "ssr" }, inspectorPort: false }),
    tanstackStart({
      srcDirectory: "app",
    }),
    viteReact(),
  ],
});
