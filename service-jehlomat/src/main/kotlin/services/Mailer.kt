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
    fun sendOrganizationConfirmationEmail(organization: Organization, adminEmail: String)
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
    override fun sendOrganizationConfirmationEmail(organization: Organization, adminEmail: String) {
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

    private fun prepareBodyWithLink(
        templateId: Int,
        subject: String,
        link: String,
        toEmail: String,
        organizationName: String
    ): JSONArray {
        return prepareBodyGeneral(templateId, subject, toEmail, organizationName, JSONObject().put("CONFIRM_LINK", link))
    }

    private fun prepareBodyGeneral(
        templateId: Int,
        subject: String,
        toEmail: String,
        toName: String,
        attributes: JSONObject
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
                                    .put("Name", toName)
                            )
                    )
                    .put(Emailv31.Message.TEMPLATEID, templateId)
                    .put(Emailv31.Message.TEMPLATELANGUAGE, true)
                    .put(Emailv31.Message.SUBJECT, subject)
                    .put(Emailv31.Message.VARIABLES,  attributes
                    )
            )
    }

    @Throws(MailjetException::class)
    override fun sendOrganizationConfirmationEmail(organization: Organization, adminEmail: String) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, prepareBodyGeneral(
                    3712102,
                    "Schválení organizace",
                    PermissionService.getSuperAdminEmail(),
                    "Super Admin",
                    JSONObject()
                        .put("CONFIRM_LINK", "${publicUrl}organizace/povoleni/${organization.id}")
                        .put("ORGANIZATION_NAME", organization.name)
                        .put("ORGANIZATION_EMAIL", adminEmail)
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
                Emailv31.MESSAGES, prepareBodyWithLink(
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
                Emailv31.MESSAGES, prepareBodyWithLink(
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
                Emailv31.MESSAGES, prepareBodyWithLink(
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
