package utils

import model.FieldComparisonType
import model.Role

@Target(AnnotationTarget.PROPERTY)
annotation class AuthRole(val role: Role, val cmpType: FieldComparisonType = FieldComparisonType.DEFAULT)
