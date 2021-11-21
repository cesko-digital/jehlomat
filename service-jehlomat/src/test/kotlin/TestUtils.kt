import io.mockk.mockk
import io.mockk.every
import main.testMailerModule
import services.FakeMailer
import services.MailerService

class TestUtils {
    companion object {
        fun mockMailer(): MailerService {
            val mailer = mockk<FakeMailer>()
            testMailerModule = org.koin.dsl.module {
                single<MailerService> { mailer }
            };
            every { mailer.sendRegistrationConfirmationEmail(any(), any()) } returns Unit
            every { mailer.sendOrganizationConfirmationEmail(any(), any()) } returns Unit
            every { mailer.sendSyringeFindingConfirmation(any(), any()) } returns Unit
            every { mailer.sendSyringeFinding(any(), any(), any()) } returns Unit

            return mailer
        }
    }
}