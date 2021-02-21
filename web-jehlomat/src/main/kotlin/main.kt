import app.app
import app.localModule
import app.productionModule
import externals.process
import kotlinx.browser.document
import kotlinx.browser.window
import org.koin.core.context.GlobalContext
import org.koin.core.context.GlobalContext.get
import react.dom.render

enum class Environment {
    Local,
    Production
}

val environment = if (process.env.NODE_ENV == "production") {
    Environment.Production
} else {
    Environment.Local
}

fun main() {
    window.onload = {
        GlobalContext.startKoin {
            if (environment == Environment.Local) {
                modules(localModule)
            } else {
                modules(productionModule)
            }
        }

        render(document.getElementById("root")) {
            app()
        }
    }
}

inline fun <reified T>koin(): T {
    return try {
        get().get()
    } catch (exception: Exception) {
        console.error("Called koin() before startKoin(), koin() can't be called as a static top-level declaration.")
        throw exception
    }
}