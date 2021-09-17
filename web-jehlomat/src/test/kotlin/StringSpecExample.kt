import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.should
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.startWith

class StringSpecExample : StringSpec({
    "length should return size of string" {
        "hello".length shouldBe 5
    }
    "startWith should test for a prefix" {
        "world" should startWith("wor")
    }
})