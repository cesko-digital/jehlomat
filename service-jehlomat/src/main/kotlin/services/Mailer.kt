package services
import com.mailjet.client.errors.MailjetException
import com.mailjet.client.MailjetClient
import com.mailjet.client.MailjetRequest
import com.mailjet.client.MailjetResponse
import com.mailjet.client.ClientOptions
import com.mailjet.client.resource.Emailv31
import model.Organization
import org.json.JSONArray
import org.json.JSONObject

interface MailerService {
    fun sendRegistrationConfirmationEmail(organization: Organization, userEmail: String, verificationCode: String)
    fun sendOrganizationConfirmationEmail(organization: Organization, email: String)
    fun sendSyringeFindingConfirmation(email: String, syringeId: String)
    fun sendSyringeFinding(organization: Organization, email: String, syringeId: String)
}


class FakeMailer: MailerService {
    override fun sendRegistrationConfirmationEmail(
        organization: Organization,
        userEmail: String,
        verificationCode: String
    ) {
        println("sendRegistrationConfirmationEmail")
    }
    override fun sendOrganizationConfirmationEmail(organization: Organization, email: String) {
        println("sendOrganizationConfirmationEmail")
    }
    override fun sendSyringeFindingConfirmation(email: String, syringeId: String) {
        println("sendSyringeFindingConfirmation")
    }
    override fun sendSyringeFinding(organization: Organization, email: String, syringeId: String) {
        println("sendSyringeFinding")
    }
}


class Mailer: MailerService {
    private val publicUrl = System.getenv("JWT_ISSUER")
    private val client = MailjetClient(
        ClientOptions.builder()
            .apiKey(System.getenv("MAILJET_PUBLIC_KEY"))
            .apiSecretKey(System.getenv("MAILJET_PRIVATE_KEY"))
            .build())

    private fun prepareBody(
        templateId: Int,
        subject: String,
        link: String,
        toEmail: String,
        organizationName: String
    ): JSONArray {
        return JSONArray()
        .put(
            JSONObject()
                .put(
                    Emailv31.Message.FROM, JSONObject()
                        .put("Email", "info@jehlomat.cz")
                        .put("Name", "Jehlomat")
                )
                .put(
                    Emailv31.Message.TO, JSONArray()
                        .put(
                            JSONObject()
                                .put("Email", toEmail)
                                .put("Name", organizationName)
                        )
                )
                .put(Emailv31.Message.TEMPLATEID, templateId)
                .put(Emailv31.Message.TEMPLATELANGUAGE, true)
                .put(Emailv31.Message.SUBJECT, subject)
                .put(Emailv31.Message.VARIABLES,  JSONObject()
                    .put("CONFIRM_LINK", link)
                )
        )
    }

    @Throws(MailjetException::class)
    override fun sendOrganizationConfirmationEmail(organization: Organization, email: String) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, prepareBody(
                    3222927, // TODO: JH-32 this is a dummy number, a template doesn't exist yet
                    "Schválení organizace",
                    "${publicUrl}api/v1/jehlomat/verification/organization?orgId=${organization.id}",
                    PermissionService.getSuperAdminEmail(),
                    organization.name,
                )
            )
        val response: MailjetResponse = client.post(request)

        println(response.status)
        println(response.data)
    }

    @Throws(MailjetException::class)
    override fun sendRegistrationConfirmationEmail(
        organization: Organization,
        userEmail: String,
        verificationCode: String
    ) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, prepareBody(
                    3222927,
                    "Dokončení registrace",
                    "${publicUrl}uzivatel/registrace/?email=${userEmail}&code=${verificationCode}",
                    userEmail,
                    organization.name
                )
            )
        val response: MailjetResponse = client.post(request)

        println(response.status)
        println(response.data)
    }

    @Throws(MailjetException::class)
    override fun sendSyringeFindingConfirmation(email: String, syringeId: String) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, prepareBody(
                    3222932,
                    "Potvrzení zaznamenání nálezu",
                    "${publicUrl}api/v1/jehlomat/syringe/$syringeId/info",
                    email,
                    ""
                )
            )
        val response: MailjetResponse = client.post(request)

        println(response.status)
        println(response.data)
    }

    @Throws(MailjetException::class)
    override fun sendSyringeFinding(organization: Organization, email: String, syringeId: String) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, prepareBody(
                    3222921,
                    "Nález",
                    "${publicUrl}api/v1/jehlomat/syringe/$syringeId",
                    email,
                    organization.name
                )
            )
        val response: MailjetResponse = client.post(request)

        println(response.status)
        println(response.data)
    }
}
