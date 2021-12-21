package services

import org.junit.Test
import java.util.regex.Pattern
import kotlin.test.assertEquals

class RandomIdGeneratorTest {

    @Test
    fun testGeneration() {
        assertEquals(8, RandomIdGenerator.generateSyringeId().length)
        assert(Pattern.compile("([A-Z]*[0-9]*){8}").matcher(RandomIdGenerator.generateSyringeId()).matches())
    }
}