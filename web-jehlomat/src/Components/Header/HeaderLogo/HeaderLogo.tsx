import { FC } from "react"
import { Container } from "./HeaderLogoStyles"
import { LogoJehlomat } from "assets/logo/LogoJehlomat"

export interface IHeaderLogo {
  mobile?: boolean
}

export const HeaderLogo: FC<IHeaderLogo> = ({ mobile }) => {
  return (
    <Container mobile={mobile}>
      <LogoJehlomat width={290} color={"#fff"} />
    </Container>
  )
}
