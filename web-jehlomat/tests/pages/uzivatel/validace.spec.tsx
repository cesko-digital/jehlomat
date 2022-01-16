import * as React from "react"
import { shallow } from "enzyme"
import UserValidation from "pages/uzivatel/validace"

it("Render UserValidation", () => {
  const result = shallow(<UserValidation />).contains(
    <h2>Ověření emailové adresy</h2>
  )
  expect(result).toBeTruthy()
})
