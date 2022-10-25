# Embed Vanilla Web App Sample

This sample project shows you how to embed a static vanilla (no web framework) website
into an Android app. Most web frameworks produce similar files when you run a command,
usually `npm run build`.

## Setting it up

Our sample is already setup with an example project that should make it simpler to figure out
where you plug your files into, so you're able to just run the project from the get go. However,
if you want to embed your website, follow the below steps:

1. Open this folder in Android Studio.
2. Place your static website files (anything produced from `npm run build` or similar.
e.g. index.html, your 'assets' folder, any other loose files) into `app/src/main/assets`.
3. Make sure your static website uses relative file paths to link to its assets
(CSS, JS, images, binaries, etc.).
4. Run the app on your RealWear device.
5. You should now see your website. If content is failing to load, it's possible you
didn't add the asset into `app/src/main/assets`. No matter what subdirectory that file
is within, the app should locate it.
