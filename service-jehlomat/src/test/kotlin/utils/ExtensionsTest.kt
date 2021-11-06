package utils

import org.junit.Test
import kotlin.test.assertFalse

class ExtensionsTest {

    @Test
    fun testPasswordValidation() {
        assert("aaAA11aa".isValidPassword());
        assert("aaAA11aabbcc".isValidPassword());

        assertFalse("aaAA11".isValidPassword());
        assertFalse("aaAAbbaa".isValidPassword());
        assertFalse("aabb11aa".isValidPassword());
        assertFalse("BBAA11BB".isValidPassword());
        assertFalse("".isValidPassword());
    }
}