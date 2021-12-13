package model.pagination

import kotlinx.serialization.Serializable

private const val MAXIMUM_PAGE_SIZE = 100
private const val DEFAULT_PAGE_SIZE = 20

@Serializable
data class PageInfo (
    val index: Int,
    val size: Int
)

fun PageInfo.ensureValidity(): PageInfo {
    if (size <= 0 || size > MAXIMUM_PAGE_SIZE) {
        return PageInfo(0, DEFAULT_PAGE_SIZE)
    }

    if (index < 0) {
        return PageInfo(0, DEFAULT_PAGE_SIZE)
    }

    return this
}