import * as React from "react";
import { shallow } from "enzyme";
import { Link } from "react-router-dom";

import Dekujeme from "./Dekujeme";

it("Render Dekuji", () => {
    const result = shallow(<Dekujeme />).contains(<h2>Teď už je to na nás</h2>);
    expect(result).toBeTruthy();
});

it('Dekuji link to homepage', () => {                                       
  const wrapper = shallow(<Dekujeme />);
  expect(wrapper.find(Link).props().to).toBe('/');
 });
