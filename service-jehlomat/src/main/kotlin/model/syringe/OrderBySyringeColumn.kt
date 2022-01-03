package model.syringe

import api.LocationTable
import api.SyringeTable
import api.UserTable
import model.pagination.OrderByColumn
import org.ktorm.schema.BaseTable
import org.ktorm.schema.Column

enum class OrderBySyringeColumn(private val table: BaseTable<*>, private val column: String): OrderByColumn {
    TOWN(LocationTable, "obec"),
    CREATED_AT(SyringeTable, "created_at"),
    CREATED_BY(UserTable, "email"),
    DEMOLISHED_AT(SyringeTable, "demolished_at");

    override fun toDsl(aliases: Map<OrderByColumn, BaseTable<*>>): Column<*> {
        val tableToUse = aliases[this] ?: table
        return tableToUse[column]
    }
}