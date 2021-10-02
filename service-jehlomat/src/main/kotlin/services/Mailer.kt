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
    var client: MailjetClient? = null;
    init {
        client = MailjetClient(
            ClientOptions.builder()
                .apiKey(DefaultConfig().get().getString("mailjet.publicKey"))
                .apiSecretKey(DefaultConfig().get().getString("mailjet.privateKey"))
                .build())
    }


    @Throws(MailjetException::class)
    fun sendRegistrationConfirmationEmail(organization: Organization) {
        val request = MailjetRequest(Emailv31.resource)
            .property(
                Emailv31.MESSAGES, JSONArray()
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
                                            .put("Email", organization.administrator.email)
                                            .put("Name", organization.name)
                                    )
                            )
                            .put(Emailv31.Message.TEMPLATEID, 3222927)
                            .put(Emailv31.Message.TEMPLATELANGUAGE, true)
                            .put(Emailv31.Message.SUBJECT, "Dokončení registrace")
                            .put(Emailv31.Message.VARIABLES,  JSONObject()
                                .put("EMAIL_TO", organization.administrator.email)
                                .put("CONFIRM_LINK", "https://www.google.com")
                            )
                    )
            )
        val response: MailjetResponse = client!!.post(request)
        System.out.println(response.getStatus())
        System.out.println(response.getData())
    }
}
