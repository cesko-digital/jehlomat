import * as React from "react"
import { shallow } from "enzyme"

import Navigation from "./Navigation"

it("Render navigation", () => {
  const result = shallow(<Navigation />)
  expect(result).toBeTruthy()
})
