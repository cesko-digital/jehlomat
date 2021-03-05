import io.kotest.core.js.describe
import io.kotest.core.js.it
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.matchers.shouldBe

class BehaviorTest : BehaviorSpec({
    describe("test") {
        it("is a") { done ->
            "a".shouldBe("a")

            /*
                The parameter of this method is something that finishes the promise it's running it.
                I'm not sure how it works in the JS framework itself.
             */
            done()
        }

        describe("fail") {
            it("fails") { done ->
                1.shouldBe(2)
                done()
            }
        }
    }
})