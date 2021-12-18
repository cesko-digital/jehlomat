package services

import kotlin.random.Random

private const val SYRINGE_ID_LENGTH = 8
private const val REGISTRATION_CODE_LENGTH = 8

class RandomIdGenerator {

    companion object {
        private val charPool: List<Char> = ('A'..'Z') + ('0'..'9')

        fun generateSyringeId(): String {
            return generateString(SYRINGE_ID_LENGTH)
        }

        fun generateRegistrationCode(): String {
            return generateString(REGISTRATION_CODE_LENGTH)
        }

        private fun generateString(stringLength: Int): String {
            return (1..stringLength)
                .map { Random.nextInt(0, charPool.size) }
                .map(charPool::get)
                .joinToString("")
        }
    }
}