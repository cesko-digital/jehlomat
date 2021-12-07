package model.pagination

import api.SyringeTable
import api.UserTable
import model.syringe.OrderBySyringeColumn
import org.junit.Assert.assertTrue
import org.junit.Test
import org.ktorm.expression.ColumnExpression
import org.ktorm.expression.OrderType
import kotlin.test.assertEquals

class OrderByDefinitionTest {
    private val defaultOrder = OrderByDefinition(OrderBySyringeColumn.CREATED_AT, OrderByDirection.ASC)

    @Test
    fun testEnsureValidityDefaultOrder() {
        val orderByList: List<OrderByDefinition<OrderBySyringeColumn>> = listOf()
        val validated = orderByList.ensureValidity(defaultOrder)

        assertEquals(1, validated.size)
        assertEquals(OrderBySyringeColumn.CREATED_AT, validated.first().column)
        assertEquals(OrderByDirection.ASC, validated.first().direction)
    }

    @Test
    fun testEnsureValidityMaximumOrderDirectives() {
        val orderByList: MutableList<OrderByDefinition<OrderBySyringeColumn>> = mutableListOf()
        for (i in 1..20) {
            orderByList.add(OrderByDefinition(OrderBySyringeColumn.CREATED_AT, OrderByDirection.ASC))
        }
        assertEquals(3, orderByList.ensureValidity(defaultOrder).size)
    }

    @Test
    fun testTransformToDsl() {
        val expr = OrderByDefinition(OrderBySyringeColumn.CREATED_AT, OrderByDirection.DESC).toDsl(mapOf())
        assertEquals(OrderType.DESCENDING, expr.orderType)
        assertTrue(expr.expression is ColumnExpression)
        assertEquals("syringes", (expr.expression as ColumnExpression).table?.name)
        assertEquals(null, (expr.expression as ColumnExpression).table?.tableAlias)
        assertEquals("created_at", (expr.expression as ColumnExpression).name)
    }

    @Test
    fun testTransformToDslAlias() {
        val aliasedTable = UserTable.aliased("aliasName")

        val alias = Pair(OrderBySyringeColumn.CREATED_BY, aliasedTable)
        val expr = OrderByDefinition(OrderBySyringeColumn.CREATED_BY, OrderByDirection.ASC).toDsl(mapOf(alias))

        assertEquals(OrderType.ASCENDING, expr.orderType)
        assertTrue(expr.expression is ColumnExpression)
        assertEquals("users", (expr.expression as ColumnExpression).table?.name)
        assertEquals("aliasName", (expr.expression as ColumnExpression).table?.tableAlias)
        assertEquals("email", (expr.expression as ColumnExpression).name)
    }
}