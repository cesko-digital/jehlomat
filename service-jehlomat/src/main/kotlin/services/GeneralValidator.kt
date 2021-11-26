package services

import utils.UnchangeableByPut
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

class GeneralValidator {
    companion object {
        fun <T> validateUnchangeableByPut(currentVersion: T, newVersion: T): String? {
            if (currentVersion == null || newVersion == null) {
                return null
            }

            val kClass = currentVersion.javaClass.kotlin;

            for (member in kClass.memberProperties) {
                if (member.findAnnotation<UnchangeableByPut>() != null &&
                    member.get(currentVersion) != member.get(newVersion)
                ) {
                    return member.name
                }
            }

            return null
        }
    }
}