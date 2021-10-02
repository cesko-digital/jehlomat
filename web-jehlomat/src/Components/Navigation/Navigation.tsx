import React, {FC} from "react";
import * as s from "./NavigationStyles";
import {NavigationButtonType, PrimaryNavigationButton, SecondaryNavigationButton} from "./NavigationButton";
import {useHistory, useLocation} from "react-router-dom";

const Navigation: FC = ({}) => {
  let history = useHistory()
  let location = useLocation()

  return <s.Container>
    <s.GlobalBody />
    <s.LeftBar>
      <SecondaryNavigationButton route="/profile" selected={ location.pathname === "/profile"} type={NavigationButtonType.Profile}/>
      <SecondaryNavigationButton route="/nalezy" selected={ location.pathname === "/nalezy"} type={NavigationButtonType.SyringeList}/>
      <SecondaryNavigationButton route="/organizace" selected={ location.pathname === "/organizace"} type={NavigationButtonType.Users}/>
    </s.LeftBar>
    <s.PrimaryBar onClick={ () => history.push("/novy-nalez")}>
      <PrimaryNavigationButton />
    </s.PrimaryBar>
  </s.Container>
}

export default Navigation
