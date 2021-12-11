package services

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import model.User
import java.security.KeyPair
import java.security.KeyPairGenerator
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.util.*

private const val TOKEN_LIFESPAN_MS = 60000
private const val KEY_SIZE = 3072
const val JWT_PAYLOAD_PROPERTY_NAME = "user-id"
const val JWT_CONFIG_NAME = "auth-jwt"

class JwtManager(
    private val issuer: String = System.getenv("JWT_ISSUER"),
    private val audience: String = System.getenv("JWT_AUDIENCE"),
    val realm: String = System.getenv("JWT_REALM")
) {

    private val publicKeyId = "jehlomatJwtKeyPair"
    private val keyPair: KeyPair = generateKeyPair()

    fun generateJwk(): Map<String, Any> {
        val rsaPublic = keyPair.public as RSAPublicKey
        val values: MutableMap<String, Any> = HashMap()

        values["kty"] = rsaPublic.algorithm
        values["kid"] = publicKeyId
        values["n"] = Base64.getUrlEncoder().encodeToString(rsaPublic.modulus.toByteArray())
        values["e"] = Base64.getUrlEncoder().encodeToString(rsaPublic.publicExponent.toByteArray())
        values["alg"] = "RS256"
        values["use"] = "sig"

        return values
    }

    fun createVerifier(): JWTVerifier {
        return JWT
            .require(Algorithm.RSA256(keyPair.public as RSAPublicKey?, keyPair.private as RSAPrivateKey?))
            .withAudience(audience)
            .withIssuer(issuer)
            .build()
    }

    private fun generateKeyPair(): KeyPair {
        val keyPairGenerator = KeyPairGenerator.getInstance("RSA")
        keyPairGenerator.initialize(KEY_SIZE)
        return keyPairGenerator.genKeyPair()
    }

    fun createToken(userId: Int): String {
        return JWT.create()
            .withAudience(audience)
            .withIssuer(issuer)
            .withClaim(JWT_PAYLOAD_PROPERTY_NAME, userId)
            .withExpiresAt(Date(System.currentTimeMillis() + TOKEN_LIFESPAN_MS))
            .sign(Algorithm.RSA256(keyPair.public as RSAPublicKey, keyPair.private as RSAPrivateKey))
    }

    fun getLoggedInUser(appCall: ApplicationCall, databaseService: DatabaseService): User {
        val principal = appCall.principal<JWTPrincipal>()
        val userId = principal!!.payload.getClaim(JWT_PAYLOAD_PROPERTY_NAME).asInt()
        val user = databaseService.selectUserById(userId)

        if (user != null) {
            return user
        } else {
            throw RuntimeException("Logged in as a nonexistent user.")
        }
    }
}