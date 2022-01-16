import type { NextPage } from "next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import styled from "@emotion/styled"
import { primary, white } from "utils/colors"
import SecondaryButton from "components/Buttons/SecondaryButton/SecondaryButton"
import Link from "next/link"
import { LINKS } from "utils/links"

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  color: ${white};
  background-color: ${primary};
`
const InfoText = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  text-align: center;
`
const SecondaryIcon = styled(FontAwesomeIcon)`
  color: ${white};
`
const Body = styled.div`
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
`
const Footer = styled.div`
  margin-left: 3rem;
  margin-right: 3rem;
  margin-top: 1rem;
  border-top: 1px solid ${white};
  justify-content: center;
  align-items: center;
  text-align: center;
`

const UserValidation: NextPage = () => {
  return (
    <Container>
      <Body>
        <h2>Ověření emailové adresy</h2>
        <SecondaryIcon icon={faEnvelope} size="3x" />
        <InfoText>
          Zaslali jsme vám ověřovací email na adresu TBD. Pro dokončení
          registrace klikněte na link v e-mailu.
        </InfoText>
        <Link href={LINKS.userNew} passHref>
          <a>
            <SecondaryButton text="Zpět na přihlášení" />
          </a>
        </Link>
      </Body>
      <Footer>
        <div>Jestli jste neobdrželi e-mail</div>
        <div>Zaslat email znovu</div>
      </Footer>
    </Container>
  )
}

export default UserValidation
