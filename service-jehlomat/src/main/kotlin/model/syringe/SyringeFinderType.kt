package model.syringe

import kotlinx.serialization.Serializable

@Serializable
enum class SyringeFinderType {
    USER, TEAM, ORGANIZATION, ANONYMOUS
}