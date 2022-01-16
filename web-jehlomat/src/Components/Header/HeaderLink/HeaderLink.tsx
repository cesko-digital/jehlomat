import { useRouter } from "next/router"
import React, { FC } from "react"
import { Container, Link } from "./HeaderLinkStyles"

export enum HeaderLinkType {
  AboutApp,
  CreateOrgAccount,
  Watch,
  Login,
}

export interface IHeaderLink {
  type: HeaderLinkType
  route: string
  mobile?: boolean
}

export const HeaderLink: FC<IHeaderLink> = ({ type, route, mobile }) => {
  const router = useRouter()

  return (
    <Container mobile={mobile} onClick={() => router.push(route)}>
      <Link mobile={mobile}>{titleForType(type)}</Link>
    </Container>
  )
}

function titleForType(type: HeaderLinkType): string {
  switch (type) {
    case HeaderLinkType.AboutApp:
      return "O aplikaci"
    case HeaderLinkType.CreateOrgAccount:
      return "Založit organizaci"
    case HeaderLinkType.Watch:
      return "Sledovat nález"
    case HeaderLinkType.Login:
      return "Přihlásit se"
  }
}
