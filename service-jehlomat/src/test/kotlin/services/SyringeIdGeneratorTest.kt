package services

import org.junit.Test
import java.util.regex.Pattern
import kotlin.test.assertEquals

class SyringeIdGeneratorTest {

    @Test
    fun testGeneration() {
        val generator = SyringeIdGenerator()
        assertEquals(8, generator.generateId().length)
        assert(Pattern.compile("([A-Z]*[0-9]*){8}").matcher(generator.generateId()).matches())
    }
}