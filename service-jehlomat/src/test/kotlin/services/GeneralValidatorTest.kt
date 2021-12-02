package services

import org.junit.Assert.assertNull
import org.junit.Test
import utils.UnchangeableByPut
import kotlin.test.assertEquals

class GeneralValidatorTest {
    @Test
    fun testValidateUnchangeableByPut() {
        val original = TestPutFieldsClass("a1", "b1")

        assertNull(GeneralValidator.validateUnchangeableByPut(original, original))
        assertNull(GeneralValidator.validateUnchangeableByPut(original, original.copy()))
        assertNull(GeneralValidator.validateUnchangeableByPut(original, original.copy(modifiableField = "a2")))

        assertEquals("unmodifiableField",
            GeneralValidator.validateUnchangeableByPut(
                original,
                TestPutFieldsClass("a1", "b2")
            )
        )
    }

    data class TestPutFieldsClass (
        val modifiableField: String,
        @UnchangeableByPut val unmodifiableField: String
    )
}



