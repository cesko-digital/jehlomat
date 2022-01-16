import { FC } from "react"
import { Container } from "./FooterLogoStyles"
import logo from "assets/logo/logo-magdalena.svg"

export const FooterLogo: FC = ({}) => {
  return (
    <Container>
      <img src={logo} />
    </Container>
  )
}
