import { faCheck, faEdit, faMap } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC } from "react"
import styled from "@emotion/styled"
import PrimaryButton from "components/Buttons/PrimaryButton/PrimaryButton"
import Navigation from "components/Navigation/Navigation"
import { primaryDark, white } from "utils/colors"
import { Header } from "components/Header/Header"
import { STEPS } from "pages/novy-nalez"

interface iInfo {
  handleStepChange: (newStep: STEPS) => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
interface iCard {
  backgroundColor: string
}

const Card = styled.div<iCard>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.backgroundColor};
  padding: 1rem 0rem;
  flex-grow: 1;
`

const Icon = styled.div`
  background-color: ${white};
  margin: auto;
  border-radius: 50%;
  border: 3px solid ${primaryDark};
  width: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Title = styled.h6`
  text-align: center;
  font-size: 16px;
  line-height: 18.75px;
  color: ${primaryDark};
  margin: 0.5rem 0;
`

const MutedText = styled.p`
  text-align: center;
  color: #898a8d;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.4px;
  margin: 0;
`

const Info: FC<iInfo> = ({ handleStepChange }) => {
  return (
    <>
      <Header mobileTitle="Zadávaní nálezu" />

      <Container>
        <Card backgroundColor="#BFE3E0">
          <Icon>
            <FontAwesomeIcon icon={faMap} size="2x" color={primaryDark} />
          </Icon>
          <Title>Přidat do mapy</Title>
          <MutedText>Nejprve označte místo nálezu do mapy</MutedText>
        </Card>
        <Card backgroundColor="#CDEAE7">
          <Icon>
            <FontAwesomeIcon icon={faEdit} size="2x" color={primaryDark} />
          </Icon>
          <Title>Přidat podrobnosti do mapy</Title>
          <MutedText>
            Poté vložte podrobnosti o nálezu a jeho fotografii.
          </MutedText>
        </Card>
        <Card backgroundColor="#DEF1EF">
          <Icon>
            <FontAwesomeIcon icon={faCheck} size="2x" color={primaryDark} />
          </Icon>
          <Title>Úspěšné vložení nálezu</Title>
          <MutedText>Nález bude profesionálně zlikvidován</MutedText>
        </Card>
        <Card backgroundColor="#EEF8F7">
          <PrimaryButton
            text="Zadat nález do mapy"
            onClick={() => handleStepChange(STEPS.Mapa)}
          />
        </Card>
        <Navigation></Navigation>
      </Container>
    </>
  )
}

export default Info
