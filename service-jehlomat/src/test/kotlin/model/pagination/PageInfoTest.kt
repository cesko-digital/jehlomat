package model.pagination

import org.junit.Test
import kotlin.test.assertEquals

class PageInfoTest {

    @Test
    fun testEnsureValidity() {
        assertEquals(20, PageInfo(0, -1).ensureValidity().size)
        assertEquals(20, PageInfo(0, 1000).ensureValidity().size)
        assertEquals(0, PageInfo(-10, 30).ensureValidity().index)
    }

}