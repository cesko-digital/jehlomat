package model.syringe

import kotlinx.serialization.Serializable
import model.pagination.OrderByDefinition
import model.pagination.PageInfo

@Serializable
data class SyringeFilterRequest (
    val filter: SyringeFilter,
    val pageInfo: PageInfo,
    val ordering: List<OrderByDefinition<OrderBySyringeColumn>>
)

