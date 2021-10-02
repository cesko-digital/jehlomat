package services
import com.mailjet.client.errors.MailjetException
import com.mailjet.client.MailjetClient
import com.mailjet.client.MailjetRequest
import com.mailjet.client.MailjetResponse
import com.mailjet.client.ClientOptions
import com.mailjet.client.resource.Emailv31
import model.Organization
import model.UserInfo
import org.json.JSONArray
import org.json.JSONObject
import utils.DefaultConfig

class Mailer() {
    private val appConfig = DefaultConfig().get()
    private val client = MailjetClient(
        ClientOptions.builder()
            .apiKey(appConfig.getString("mailjet.publicKey"))
            .apiSecretKey(appConfig.getString("mailjet.privateKey"))
            .build())

    fun prepareBody(templateId: Int, subject: String, link: String,
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
                            JSONObject()
                                .put("Email", organization?.administrator?.email ?: user!!.email)
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
    fun sendRegistrationConfirmationEmail(organization: Organization) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, prepareBody(
                    3222927,
                    "Dokončení registrace",
                    "https://jehlomat.cz/api/v1/jehlomat/verification?orgName=${organization.name}",
                    organization
                )
            )
        val response: MailjetResponse = client.post(request)

        System.out.println(response.getStatus())
        System.out.println(response.getData())
    }

    @Throws(MailjetException::class)
    fun sendSyringeFindingConfirmation(user: UserInfo) {
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

        System.out.println(response.getStatus())
        System.out.println(response.getData())
    }

    @Throws(MailjetException::class)
    fun sendSyringeFinding(organization: Organization) {
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

        System.out.println(response.getStatus())
        System.out.println(response.getData())
    }
}
