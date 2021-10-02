import * as React from "react";
import { shallow } from "enzyme";

import App from "./App";

it("Render App", () => {
    const result = shallow(<App />).contains(<h3>Hello Jehlomat</h3>);
    expect(result).toBeTruthy();
});