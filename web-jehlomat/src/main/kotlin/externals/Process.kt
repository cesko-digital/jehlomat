package externals

external val process: Process

external interface Process {
    val env: dynamic
}