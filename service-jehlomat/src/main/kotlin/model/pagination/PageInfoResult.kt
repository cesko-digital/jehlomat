package model.pagination

import kotlinx.serialization.Serializable

@Serializable
data class PageInfoResult (
    val index: Int,
    val size: Int,
    val hasMore: Boolean
)