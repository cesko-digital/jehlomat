package services

class SyringeIdGenerator {
    private val charPool: List<Char> = ('A'..'Z') + ('0'..'9')
    private val idLength = 8

    fun generateId(): String {
       return (1..idLength)
            .map { kotlin.random.Random.nextInt(0, charPool.size) }
            .map(charPool::get)
            .joinToString("")
    }
}