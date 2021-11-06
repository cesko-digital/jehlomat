val ktorVersion: String by project
val ktormVersion: String = "3.4.1"
val jacksonVersion: String = "2.13.0"

plugins {
    application
    kotlin("jvm")
    kotlin("plugin.serialization")
    id("com.github.johnrengelman.shadow")
}

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}

dependencies {
    implementation(kotlin("stdlib", version="1.5.31"))

    // Ktor
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
    implementation("io.ktor:ktor-server-core:$ktorVersion")
    implementation("io.ktor:ktor-jackson:$ktorVersion")
    implementation("io.ktor:ktor-html-builder:$ktorVersion")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.3.0")
    testImplementation("io.ktor:ktor-server-tests:$ktorVersion")
    testImplementation("io.ktor:ktor-server-test-host:$ktorVersion")

    // Jackson serializer modules
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-joda:$jacksonVersion")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:$jacksonVersion")

    implementation("ch.qos.logback:logback-classic:1.2.6")

    // Koin DI
    implementation("org.koin:koin-ktor:2.0.1")

    // Http client
    implementation("com.github.kittinunf.fuel:fuel:2.3.1")

    // Ktorm
    implementation("org.ktorm:ktorm-core:${ktormVersion}")
    implementation("org.ktorm:ktorm-support-postgresql:${ktormVersion}")
    implementation("org.postgresql:postgresql:42.2.24")

    // Config
    implementation("com.typesafe:config:1.4.1")

    // Mock
    testImplementation("io.mockk:mockk:1.12.0")

    //Mailjet
    implementation("com.mailjet:mailjet-client:5.2.0")

    //Swager API
    implementation("com.github.papsign:Ktor-OpenAPI-Generator:-SNAPSHOT")
}

tasks.named<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar>("shadowJar") {
    archiveBaseName.set(project.name)
    archiveVersion.set("")
    archiveAppendix.set("")
}
