package com.realwear.samplewebapp

import android.net.Uri
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.annotation.RequiresApi
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import com.realwear.samplewebapp.ui.theme.SampleWebAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SampleWebAppTheme {
                Surface(modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colors.background) {
                    // NOTE: This is equivalent to
                    // override fun onCreate() {
                    //   val webView = getElementById(r.id.webview)
                    //   ...
                    // }
                    // for xml-based layouts.
                    AndroidView(
                        factory = {
                            WebView(it).apply {
                                // Configure
                                webViewClient = LocalContentWebViewClient(
                                    WebViewAssetLoader.Builder()
                                        // Search for html, css, js files in src/main/assets/assets
                                        .addPathHandler("/assets/",
                                            WebViewAssetLoader.AssetsPathHandler(it))
                                        // Search for images and binaries in src/main/assets/assets
                                        .addPathHandler("/assets/",
                                            WebViewAssetLoader.ResourcesPathHandler(it))
                                        // NOTE: Add specific paths here that locate your static website's
                                        // resources to speed up resource location in bigger projects
                                        .build()
                                )
                                settings.javaScriptEnabled = true

                                // Load your website
                                // NOTE: this line does not need to be changed! Your compiled website's
                                // index.html should be in src/main/assets.
                                loadUrl("https://appassets.androidplatform.net/assets/index.html")
                            }
                        }
                    )
                }
            }
        }
    }
}

private class LocalContentWebViewClient(private val assetLoader: WebViewAssetLoader) :
    WebViewClientCompat() {
    @RequiresApi(21)
    override fun shouldInterceptRequest(
        view: WebView,
        request: WebResourceRequest,
    ): WebResourceResponse? {
        return assetLoader.shouldInterceptRequest(request.url)
    }

    // to support API < 21
    @Deprecated("Deprecated in Java")
    override fun shouldInterceptRequest(
        view: WebView,
        url: String,
    ): WebResourceResponse? {
        return assetLoader.shouldInterceptRequest(Uri.parse(url))
    }
}

@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!")
}

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    SampleWebAppTheme {
        Greeting("Android")
    }
}