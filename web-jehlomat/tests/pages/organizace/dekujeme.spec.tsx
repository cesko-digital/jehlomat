import * as React from "react"
import { shallow } from "enzyme"
import OrganizationThank from "pages/organizace/dekujeme"

it("Render OrganizationThank", () => {
  const result = shallow(<OrganizationThank />).contains(
    <h2>Teď už je to na nás</h2>
  )
  expect(result).toBeTruthy()
})
