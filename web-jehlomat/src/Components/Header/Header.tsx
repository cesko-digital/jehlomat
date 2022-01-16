import { SContainer, SLinkContainer, SMobileContainer } from "./HeaderStyles"
import { HeaderLink, HeaderLinkType } from "./HeaderLink/HeaderLink"
import { HeaderLogo } from "./HeaderLogo/HeaderLogo"
import TitleBar from "../Navigation/TitleBar"
import { LINKS } from "utils/links"

interface Props {
  mobileTitle: string
  backRoute?: string
}

export const Header = (props: Props) => {
  return (
    <>
      <SContainer>
        <HeaderLogo />
        <SLinkContainer>
          <HeaderLink type={HeaderLinkType.AboutApp} route={LINKS.about} />
          <HeaderLink
            type={HeaderLinkType.CreateOrgAccount}
            route={LINKS.organizationRegistration}
          />
          <HeaderLink type={HeaderLinkType.Login} route={LINKS.login} />
        </SLinkContainer>
      </SContainer>

      <SMobileContainer>
        <TitleBar>{props.mobileTitle}</TitleBar>
      </SMobileContainer>
    </>
  )
}
