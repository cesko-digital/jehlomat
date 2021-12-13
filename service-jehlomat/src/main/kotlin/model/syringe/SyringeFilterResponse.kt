package model.syringe

import kotlinx.serialization.Serializable
import model.Syringe
import model.pagination.PageInfoResult

@Serializable
data class SyringeFilterResponse (
    val syringeList: List<Syringe>,
    val pageInfo: PageInfoResult
)