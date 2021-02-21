plugins {
    base
    kotlin("jvm") version "1.4.30" apply false
    kotlin("js") version "1.4.30" apply false
    kotlin("plugin.serialization") version "1.4.30" apply false
    id("com.github.johnrengelman.shadow") version "5.1.0" apply false
}

allprojects {
    group = "digital.cesko"
    version = "1.0"

    repositories {
        mavenCentral()
        jcenter()
        maven { url = uri("https://kotlin.bintray.com/ktor") }
        maven { setUrl("http://dl.bintray.com/kotlin/kotlinx.html") }
        maven { setUrl("http://dl.bintray.com/kotlin/kotlin-js-wrappers") }
        maven { setUrl("http://dl.bintray.com/kotlin/kotlinx") }
        maven { url = uri("https://dl.bintray.com/ekito/koin") }
    }
}
