package model.pagination

import kotlinx.serialization.Serializable
import org.ktorm.dsl.asc
import org.ktorm.dsl.desc
import org.ktorm.expression.OrderByExpression
import org.ktorm.schema.BaseTable
import java.util.*

private const val MAXIMUM_ORDERING = 3

@Serializable
data class OrderByDefinition<T: OrderByColumn> (
    val column: T,
    val direction: OrderByDirection
)

fun <T : OrderByColumn> OrderByDefinition<T>.toDsl(aliases: Map<OrderByColumn, BaseTable<*>>): OrderByExpression = when (direction) {
    OrderByDirection.ASC -> column.toDsl(aliases).asc()
    OrderByDirection.DESC -> column.toDsl(aliases).desc()
}

fun <T : OrderByColumn> List<OrderByDefinition<T>>.ensureValidity(defaultOrder: OrderByDefinition<T>): List<OrderByDefinition<T>> {
    if (this.isEmpty()) {
        return Collections.singletonList(defaultOrder)
    }

    if (this.size > MAXIMUM_ORDERING) {
        return this.subList(0, MAXIMUM_ORDERING)
    }

    return this
}

