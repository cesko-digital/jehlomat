import * as React from "react";
import { shallow } from "enzyme";
import { Link } from "react-router-dom";

import OvereniEmailu from "./OvereniEmailu";

it("Render OvereniEmailu", () => {
  const result = shallow(<OvereniEmailu />).contains(<h2>Ověření emailové adresy</h2>);
  expect(result).toBeTruthy();
});

it("OvereniEmailu link to homepage", () => {
  const wrapper = shallow(<OvereniEmailu />);
  expect(wrapper.find(Link).props().to).toBe("/");
});
