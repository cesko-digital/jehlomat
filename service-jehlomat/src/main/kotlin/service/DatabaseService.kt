package service

import api.SyringeTable
import api.UserTable
import model.Syringe
import model.User
import org.ktorm.database.Database
import org.ktorm.dsl.insert
import org.ktorm.dsl.insertAndGenerateKey



object DatabaseService {

    fun getInstance(
        host: String,
        port: String,
        database: String,
        user: String,
        password: String
    ): Database {
        return Database.connect(
            "jdbc:postgresql://$host:$port/$database", user = user, password = password
        )
    }

    fun insertSyringe(databaseInstance: Database, syringe: Syringe) {
        databaseInstance.insertAndGenerateKey(SyringeTable) {
            set(it.timestamp, syringe.timestamp)
            set(it.email, syringe.email)
            set(it.photo, syringe.photo)
            set(it.count, syringe.count)
            set(it.note, syringe.note)
            set(it.demolisherType, syringe.demolisher)
            set(it.gps_coordinates, syringe.gps_coordinates)
        }
    }

    fun insertUser(databaseInstance: Database, user: User) {
        databaseInstance.insert(UserTable) {
            set(it.email, user.email)
            set(it.password, user.password)
            set(it.verified, user.verified)
        }
    }
}