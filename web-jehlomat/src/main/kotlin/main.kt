import app.app
import app.localModule
import app.productionModule
import externals.process
import kotlinx.browser.document
import kotlinx.browser.window
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import org.koin.core.context.GlobalContext
import org.koin.core.context.GlobalContext.get
import react.dom.render
import store.RollbackState
import store.State
import store.appStore

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

    window.onpopstate = {
        console.info(it)
        if (it.state != null && it.state is String) {
            val state: State = Json.decodeFromString(it.state as String)
            appStore.dispatch(
                RollbackState(
                    state = state
                )
            )
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