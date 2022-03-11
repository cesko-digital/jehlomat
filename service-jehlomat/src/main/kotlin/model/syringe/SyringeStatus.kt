package model.syringe

import model.Syringe
import java.time.LocalDateTime
import java.time.ZoneOffset

enum class SyringeStatus {
    WAITING, RESERVED, DEMOLISHED;

    companion object {
        fun fromDbRecord(detail: Syringe): SyringeStatus {
            return if (detail.demolishedAt != null) {
                DEMOLISHED
            } else if (detail.reservedTill != null
                && detail.reservedTill > LocalDateTime.now().toEpochSecond(ZoneOffset.UTC)) {
                RESERVED
            } else {
                WAITING
            }
        }
    }
}
