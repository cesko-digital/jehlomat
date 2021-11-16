package services
import com.mailjet.client.errors.MailjetException
import com.mailjet.client.MailjetClient
import com.mailjet.client.MailjetRequest
import com.mailjet.client.MailjetResponse
import com.mailjet.client.ClientOptions
import com.mailjet.client.resource.Emailv31
import model.Organization
import model.User
import model.UserInfo
import model.toUserInfo
import org.json.JSONArray
import org.json.JSONObject
import utils.DefaultConfig


interface MailerService {
    fun sendRegistrationConfirmationEmail(user: User)
    fun sendOrganizationConfirmationEmail(organization: Organization)
    fun sendSyringeFindingConfirmation(user: UserInfo)
    fun sendSyringeFinding(organization: Organization)
}


class FakeMailer: MailerService {
    override fun sendRegistrationConfirmationEmail(user: User) {
        println("sendRegistrationConfirmationEmail")
    }
    override fun sendOrganizationConfirmationEmail(organization: Organization) {
        println("sendOrganizationConfirmationEmail")
    }
    override fun sendSyringeFindingConfirmation(user: UserInfo) {
        println("sendSyringeFindingConfirmation")
    }
    override fun sendSyringeFinding(organization: Organization) {
        println("sendSyringeFinding")
    }
}


class Mailer: MailerService {
    private val appConfig = DefaultConfig().get()
    private val client = MailjetClient(
        ClientOptions.builder()
            .apiKey(appConfig.getString("mailjet.publicKey"))
            .apiSecretKey(appConfig.getString("mailjet.privateKey"))
            .build())

    private fun prepareBody(templateId: Int, subject: String, link: String,
                            organization: Organization? = null, user: UserInfo? = null): JSONArray {
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
                            // TODO: JH-77 fix the organization confirmation email, which should be send to the superadmin email
                            JSONObject()
                                .put("Email", user!!.email)
                                .put("Name", organization?.name ?: "Jméno")
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
    override fun sendOrganizationConfirmationEmail(organization: Organization) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, prepareBody(
                    3222927, // TODO: JH-32 this is a dummy number, a template doesn't exist yet
                    "Schválení organizace",
                    "https://jehlomat.cz/api/v1/jehlomat/verification?orgId=${organization.id}",
                    organization
                )
            )
        val response: MailjetResponse = client.post(request)

        println(response.status)
        println(response.data)
    }

    @Throws(MailjetException::class)
    override fun sendRegistrationConfirmationEmail(user: User) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, prepareBody(
                    3222927,
                    "Dokončení registrace",
                    "https://jehlomat.cz/api/v1/jehlomat/verification?userId=${user.id}",
                    user = user.toUserInfo()
                )
            )
        val response: MailjetResponse = client.post(request)

        println(response.status)
        println(response.data)
    }

    @Throws(MailjetException::class)
    override fun sendSyringeFindingConfirmation(user: UserInfo) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, prepareBody(
                    3222932,
                    "Potvrzení zaznamenání nálezu",
                    "https://www.google.com",
                    user=user
                )
            )
        val response: MailjetResponse = client.post(request)

        println(response.status)
        println(response.data)
    }

    @Throws(MailjetException::class)
    override fun sendSyringeFinding(organization: Organization) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, prepareBody(
                    3222921,
                    "Nález",
                    "https://www.google.com",
                    organization
                )
            )
        val response: MailjetResponse = client.post(request)

        println(response.status)
        println(response.data)
    }
}
