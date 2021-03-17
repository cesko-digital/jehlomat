plugins {
    kotlin("js")
    kotlin("plugin.serialization")
}

dependencies {
    implementation("org.jetbrains:kotlin-react:17.0.1-pre.142-kotlin-1.4.21")
    implementation("org.jetbrains:kotlin-react-dom:17.0.1-pre.142-kotlin-1.4.21")
    implementation("org.jetbrains:kotlin-css:1.0.0-pre.142-kotlin-1.4.21")
    implementation("org.jetbrains:kotlin-css-js:1.0.0-pre.93-kotlin-1.4-M1-eap-93-3")
    implementation("org.jetbrains:kotlin-extensions:1.0.1-pre.142-kotlin-1.4.21")
    implementation("org.jetbrains:kotlin-redux:4.0.5-pre.142-kotlin-1.4.21")
    implementation("org.jetbrains:kotlin-styled:5.2.0-pre.142-kotlin-1.4.21")

    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.0.1")
    implementation("org.koin:koin-core:3.0.1-alpha-3")

    implementation(npm("google-map-react", "2.1.9", false))
    implementation(npm("@types/google-map-react", "2.1.0", false))

    testImplementation("io.kotest:kotest-framework-engine:4.4.1")
    testImplementation("io.kotest:kotest-assertions-core:4.4.1")
}

kotlin {
    js {
        browser {
            compilations.all {
                kotlinOptions {
                    kotlinOptions.metaInfo = true
                    kotlinOptions.sourceMap = true
                    kotlinOptions.moduleKind = "amd"
                }
            }
        }
        binaries.executable()
    }
}
