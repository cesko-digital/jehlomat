import { FC } from "react"
import { Container, LeftBar, PrimaryBar } from "./NavigationStyles"
import {
  NavigationButtonType,
  PrimaryNavigationButton,
  SecondaryNavigationButton,
} from "./NavigationButton"
import { LINKS } from "utils/links"
import { useRouter } from "next/router"
import Link from "next/link"
import { css, Global } from "@emotion/react"

const Navigation: FC = ({}) => {
  const location = useRouter()

  return (
    <Container>
      <Global
        styles={css`
          body {
            padding-bottom: 86px;
          }
        `}
      />
      <LeftBar>
        <SecondaryNavigationButton
          route={LINKS.profile}
          selected={location.pathname === LINKS.profile}
          type={NavigationButtonType.Profile}
        />
        <SecondaryNavigationButton
          route={LINKS.findings}
          selected={location.pathname === LINKS.findings}
          type={NavigationButtonType.SyringeList}
        />
        <SecondaryNavigationButton
          route={LINKS.user}
          selected={location.pathname === LINKS.user}
          type={NavigationButtonType.Users}
        />
      </LeftBar>
      <Link href={LINKS.newFind(0)} passHref>
        <a>
          <PrimaryBar>
            <PrimaryNavigationButton />
          </PrimaryBar>
        </a>
      </Link>
    </Container>
  )
}

export default Navigation
