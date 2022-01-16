import { FC, MouseEventHandler } from "react"
import { Container, Content, NavIcon } from "./TitleBarStyles"
import { NavigationTitle } from "utils/typography"
import { IconButton } from "@mui/material"

interface ITitleBar {
  icon?: any | undefined
  onIconClick?: MouseEventHandler | undefined
}

const TitleBar: FC<ITitleBar> = ({ icon, children, onIconClick }) => {
  return (
    <Container>
      {icon && (
        <NavIcon onClick={onIconClick}>
          <IconButton aria-label="Zpět">{icon}</IconButton>
        </NavIcon>
      )}
      <Content isCentered={!icon}>
        <NavigationTitle>{children}</NavigationTitle>
      </Content>
    </Container>
  )
}

export default TitleBar
