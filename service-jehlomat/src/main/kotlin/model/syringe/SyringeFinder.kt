package model.syringe

import kotlinx.serialization.Serializable

@Serializable
data class SyringeFinder (
    val id: Int,
    val type: SyringeFinderType
)