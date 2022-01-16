import { useRouter } from "next/router"
import React, { FC } from "react"
import { Container, Link } from "./FooterLinkStyles"

export enum FooterLinkType {
  AboutApp,
  AboutJehlomat,
  Contact,
}

export interface IFooterLink {
  type: FooterLinkType
  route: string
}

export const FooterLink: FC<IFooterLink> = ({ type, route }) => {
  const router = useRouter()

  return (
    <Container onClick={() => router.push(route)}>
      <Link>{titleForType(type)}</Link>
    </Container>
  )
}

function titleForType(type: FooterLinkType): string {
  switch (type) {
    case FooterLinkType.AboutApp:
      return "O aplikaci"
    case FooterLinkType.AboutJehlomat:
      return "O jehlomatu"
    case FooterLinkType.Contact:
      return "Kontakt"
  }
}
