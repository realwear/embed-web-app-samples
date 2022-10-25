import { exec } from "child_process";
import prompt from "prompt";

const errorLogPrefix = "\x1b[31mAndroid Hot Reload\x1b[0m";
const genericLogPrefix = "\x1b[32mAndroid Hot Reload\x1b[0m";
const attentionLogPrefix = "\x1b[35mAndroid Hot Reload\x1b[0m";

let targetDevice = ""

/**
 * Ask the user to select which device they will deploy builds to, for this session.
 * @param onSuccess Code to invoke on success.
 */
function requestTargetDevice(onSuccess: () => void) {
    exec(
        `adb devices`,
        (error, stdout, stderr) => {
            if (stderr) {
                console.log(`${errorLogPrefix} Encountered an error when launching your package:`)
                console.error(stderr)
                return
            }

            if (error) {
                console.log(`${errorLogPrefix} Encountered an error when launching your package:`)
                console.error(error)
                console.log("stdout:")
                console.error(stdout)
                return
            }

            console.log(`${attentionLogPrefix} Multiple devices are connected to your system, please enter the one you want to hot reload with for this session:`)

            console.log(stdout)

            prompt.start()

            prompt.get(['deviceId'], (err, result) => {
                targetDevice = result.deviceId.toString()
                onSuccess()
            })
        }
    )
}

/**
 * Run an Android package.
 * 
 * If more than one device is connected, will ask which device the user is referring to, then try again.
 * This device is remembered for the rest of the session.
 * @param packageName The package name.
 */
function runAndroidProject(packageName: string) {
    console.log(`${genericLogPrefix} Running package...`)

    const launchCallback = (error: any, stdout: any, stderr: any) => {
        if (stderr.indexOf("more than one device/emulator") > -1) {
            requestTargetDevice(() => {
                runAndroidProject(packageName)
            })
            return
        }

        if (
            stderr
            && !stderr.startsWith("args") // Ignore output of monkey command
        ) {
            console.log(`${errorLogPrefix} Encountered an error when launching your package:`)
            console.error(stderr)
            return
        }

        if (error) {
            console.log(`${errorLogPrefix} Encountered an error when launching your package:`)
            console.error(error)
            console.log("stdout:")
            console.error(stdout)
            return
        }

        console.log(stdout)
        console.log(`${genericLogPrefix} Launch success.`)
    }

    if (targetDevice) {
        exec(
            `adb -s ${targetDevice} shell monkey -p ${packageName} 1`,
            launchCallback
        )
    } else {
        exec(
            `adb shell monkey -p ${packageName} 1`,
            launchCallback
        )
    }
}

/**
 * Build the Android project. Asynchronous.
 * @param androidProjectPath The path to your Android project. Path must be relative to `package.json` and must be in the same directory as `gradlew.bat`.
 */
function buildAndroidProject(androidProjectPath: string, onSuccess: () => void) {
    // Don't say that we're 'building' if after a delay we've already errored
    let errored = false

    // Show logs after after Vite's logs to make them clear (it's a hack :()
    const sendAfterViteLogs = (callback: () => void) => {
        setTimeout(callback, 1000)
    }

    sendAfterViteLogs(() => {
        if (!errored) {
            console.log("")
            console.log(`${genericLogPrefix} Building...`)
        }
    })

    const gradlew = process.platform === "win32" ? "gradlew" : "./gradlew"

    exec(
        `cd ${androidProjectPath} && ${gradlew} installDebug`,
        (error, stdout, stderr) => {
            if (stderr) {
                errored = true

                sendAfterViteLogs(() => {
                    console.log("")
                    console.error(`${errorLogPrefix} Encountered an error when attempting Android hot reload (stderr):`)

                    if (stderr.endsWith("./gradlew: 68: Syntax error: word unexpected (expecting \"in\")\n")) {
                        console.error("Android hot reload failed, your 'gradlew' file has the wrong line endings. They must be LF, not CRLF.")
                    } else {
                        console.error(stderr);
                    }

                    console.log("")
                })
                return
            }

            if (error) {
                errored = true

                sendAfterViteLogs(() => {
                    console.log("")
                    console.log(`${errorLogPrefix} Encountered an error when attempting Android hot reload (error):`);
                    console.error(error);
                    console.log("stdout:")
                    console.error(stdout);

                    if (stdout.indexOf("JAVA_HOME is set to an invalid directory") > -1) {
                        console.error(`${errorLogPrefix} To fix the above error, make sure JAVA_HOME is set to a distribution of Java meant for your operating system. For instance, using "C:/Program Files/Android/Android Studio/jre" (or "/mnt/c/program files/...") will not work with Ubuntu for Windows/WSL2. In that case, install Java 11 64-bit for your Ubuntu distribution.`)
                    }
                })
                return
            }

            console.log(stdout)
            console.log(`${genericLogPrefix} Build success.`)
            onSuccess()
        }
    )
}

/**
 * Build and deploy Android project automatically when your web app hot reloads.
 * @param androidProjectPath The path to your Android project. Path must be relative to `package.json`.
 * @returns Plugin.
 */
export default function androidHotReload(packageName: string, androidProjectPath: string) {
    return {
        name: 'android-hot-reload',
        buildEnd(context: any) {
            // Build every time there is a hot reload
            buildAndroidProject(androidProjectPath, () => {
                runAndroidProject(packageName)
            })
        },
    };
}