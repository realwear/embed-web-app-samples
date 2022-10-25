# Embed Vue Web App Sample

This sample project shows you how to embed a static Vue web framework website
into an Android app.

It involves using the output from `npm run build` and plugging it into an Android web view essentially.
We have also created a hot reload Vite plugin, so that using `npm run dev-android` allows you to preview
websites changed immediately on your device.

## Setting it up

### Running the project

Our sample is already setup with an example project that should make it simpler to figure out
where you plug your files into.

However, this sample requires you to build the web app first at least:

1. You require node.js version 16 or above or running the Vue app fails.
    - To install it on Windows:
        1. Install nvm via this link https://github.com/coreybutler/nvm-windows/releases
        2. In Command Prompt, use `nvm ls`. You should have an asterisk next to a node version that is 16 or higher.
2. `cd vue-project`
3. `npm install`
4. `npm run build`
5. Open this folder in Android Studio and proceed as normal to build and run on your device.

### Hot reloading

This sample project has hot reloading setup. When you set it up and run `npm run dev-android`, any changes to files
in Vue will cause the app to re-build and deploy instantly onto your chosen device.

To setup hot reloading:

1. Ensure you've ran the above steps for building the web app, to confirm you have installed the node.js dependency.
2. Your system environment needs to have Java 11 (64-bit) setup, with a path to it linked to env variable 'JAVA_HOME'.
    1. For convenience, we use the Java distribution configured with Android Studio. You can find the path to this in
    `File > Project Structure > SDK Location > Gradle Settings` and reading the path set on `Gradle JDK`. Usually, the
    path for Windows is `C:/Program Files/Android/Android Studio/jre`.
    2. In Command Prompt, run `set JAVA_HOME="C:/Program Files/Android/Android Studio/jre"` (replace with your directory
    if different) each time you want to run hot reloading.
        - If using PowerShell, instead run `$env:JAVA_HOME = "C:/Program Files/Android/Android Studio/jre"`.
        - If using Bash, instead run `export JAVA_HOME="C:/Program Files/Android/Android Studio/jre"`.
        - For ease of use, consider setting the env variable permanently in your system environment variables
        (if you choose this option, remember to close and re-open your command prompt).
2. `cd vue-project`
3. `npm install`
4. `npm run dev-android`

### Embedding your own web app

The magic happens in `./vue-project/android-hot-reload-plugin.ts`. When the 'buildEnd' event happens, build and run
commands are triggered via command line with gradle and adb.

We have already done these steps in our sample, but key things to look out for when you embed your own web app:

1. You must configure your app as it is done in `vue-project/vite.config.ts`:
    1. Link to the Android project's root path, the folder that web app's build files should go, and specify the
    name of our package.
    2. Ensure `androidHotReload` is a plugin imported and used with Vite.
    3. Make sure the output directory of any build files is set to `androidProjectWwwAssetsPath`.
2. The Android embed activity is expecting assets in your built `index.html` to link via relative paths to any other 
assets. To ensure this happens, we specify `--base=assets/` on our `npm run dev-android` command
(see `vue-project/package.json` for the implementation). Note that the path DOES NOT begin with a `/`. You will 
have `FileNotFoundException`s in your project if there is a slash in front of any asset relative paths.
3. We use the `--watch` parameter on the same command to trigger a rebuild when any files change in the web app.
Without it, our plugin's Android hot reload would not be triggered, nor would your website actually update.
4. We add a blank `settings.gradle` inside `vue-project` so that gradle doesn't whine when you try to build your
Android project.
5. `android-hot-reload-plugin.ts` is added in `tsconfig.config.json`'s include.
6. Your web app should now be embedded.
