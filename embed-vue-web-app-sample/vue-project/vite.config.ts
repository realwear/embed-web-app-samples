import { fileURLToPath, URL } from "node:url";
import path from "node:path"

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import androidHotReload from "./android-hot-reload-plugin";

// Android hot reload config

/**
 * The package name of your Android app. We use it in adb's package run command.
 */
const packageName = "com.realwear.samplewebapp"

/**
 * The root of the Android project, gradlew.bat should reside in it.
 */
const androidProjectPath = ".."

/**
 * Where the build files from our website should go.
 */
const androidProjectWwwAssetsPath = path.join(androidProjectPath, "app/src/main/assets")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), androidHotReload(packageName, androidProjectPath)],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: androidProjectWwwAssetsPath,
  }
});
