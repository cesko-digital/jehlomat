import { FC } from "react"
import {
  ButtonContainer,
  Container,
  LineHorizontal,
  LineVertical,
  LinkContainer,
  LogoContainer,
  Title,
} from "./HeaderMobileStyles"
import { HeaderLogo } from "./HeaderLogo/HeaderLogo"
import SecondaryButton from "../Buttons/SecondaryButton/SecondaryButton"
import { HeaderLink, HeaderLinkType } from "./HeaderLink/HeaderLink"
import TextButton from "../Buttons/TextButton/TextButton"

export const HeaderMobile: FC = () => {
  return (
    <Container>
      <LogoContainer>
        <HeaderLogo mobile={true} />
      </LogoContainer>
      <Title>Monitorovací a analytický nástroj ochrany veřejného zdraví</Title>
      <ButtonContainer>
        <SecondaryButton text={"Přihlášení"} />
      </ButtonContainer>
      <LinkContainer>
        <HeaderLink
          type={HeaderLinkType.CreateOrgAccount}
          route={"create"}
          mobile={true}
        />
        <LineVertical />
        <HeaderLink
          type={HeaderLinkType.Watch}
          route={"create"}
          mobile={true}
        />
      </LinkContainer>
      <LineHorizontal />

      <div>Našli jste jehlu a nevíte, co s ní?</div>

      <div>
        <TextButton text={"Anonymní přístup"} />
      </div>
    </Container>
  )
}
