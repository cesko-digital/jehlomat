package model.pagination

import org.ktorm.schema.BaseTable
import org.ktorm.schema.Column

interface OrderByColumn {
    fun toDsl(aliases: Map<OrderByColumn, BaseTable<*>>): Column<*>
}