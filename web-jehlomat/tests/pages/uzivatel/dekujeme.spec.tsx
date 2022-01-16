import * as React from "react"
import { shallow } from "enzyme"
import UserThank from "pages/uzivatel/dekujeme"

it("Render Dekuji", () => {
  const result = shallow(<UserThank />).contains(<h2>Teď už je to na nás</h2>)
  expect(result).toBeTruthy()
})
