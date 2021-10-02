import * as React from "react";
import { shallow } from "enzyme";

import Dekujeme from "../Registrace/Registrace";

it("Render Registrace", () => {
  const result = shallow(<Dekujeme />).contains(<h2>Teď už je to na nás</h2>);
  expect(result).toBeTruthy();
});
