val ktorVersion: String by project

plugins {
    application
    kotlin("jvm")
    id("com.github.johnrengelman.shadow")
}

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}

dependencies {
    implementation(project(":common"))

    implementation(kotlin("stdlib"))

    // Ktor
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
    implementation("io.ktor:ktor-server-core:$ktorVersion")
    implementation("io.ktor:ktor-jackson:$ktorVersion")
    implementation("io.ktor:ktor-html-builder:$ktorVersion")
    testImplementation("io.ktor:ktor-server-tests:$ktorVersion")
    testImplementation("io.ktor:ktor-server-test-host:$ktorVersion")

    // Jackson serializer modules
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-joda:2.10.1")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.11.2")

    implementation("ch.qos.logback:logback-classic:1.2.3")

    // Koin DI
    implementation("org.koin:koin-ktor:2.0.1")
}

tasks.named<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar>("shadowJar") {
    archiveBaseName.set(project.name)
    archiveVersion.set("")
    archiveAppendix.set("")
}