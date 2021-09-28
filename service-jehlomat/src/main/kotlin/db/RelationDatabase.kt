package db

import api.DemolisherTable
import api.SyringeTable
import api.SyringeTable.primaryKey
import model.Syringe
import org.ktorm.database.Database
import org.ktorm.dsl.eq
import org.ktorm.dsl.from
import org.ktorm.dsl.insert
import org.ktorm.dsl.insertAndGenerateKey
import org.ktorm.schema.int
import org.ktorm.schema.long
import org.ktorm.schema.varchar

interface DatabaseService {
    fun sayHello(): String
}

class DatabaseServiceImpl(
    val host: String,
    val port: String,
    val database: String,
    val user: String,
    val password: String,
) : DatabaseService {
    val databaseInstance = Database.connect("jdbc:mysql://$host:$port/$database", user = user, password = password)

    fun insertSyringe(syringe: Syringe) {
        databaseInstance.insertAndGenerateKey(SyringeTable) {
            set(it.timestamp, "timestamp")
            set(it.email, syringe.email)
            set(it.photo, syringe.photo)
            set(it.count, syringe.count)
            set(it.note, syringe.note)
            set(it.demolisherType, syringe.demolisher)
            set(it.gps_coordinates, syringe.gps_coordinates)
        }
    }


    override fun sayHello(): String {
//        for (row in databaseInstance.from(Employees).select()) {
//            println(row[Employees.name])
//        }
        return ""
    }
}