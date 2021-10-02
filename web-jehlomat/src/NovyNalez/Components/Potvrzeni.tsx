import {FC} from 'react'
import styled from 'styled-components'
import { white, primary } from '../../Components/Utils/Colors'
import SecondaryButton from '../../Components/Buttons/SecondaryButton/SecondaryButton'

interface iPotvrzeni {
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    text-align: center;
    background-color: ${primary};
    padding: 1rem;
`

const TextContainer = styled.div`
    margin-bottom: 2rem;
`

const Title = styled.h1`
    font-size: 52px;
    color: ${white};
    align-text: center;
    margin: 1rem 0;
`

const WhiteText = styled.p`
    text-align: center;
    color: ${white};
    font-size: 14px;
    font-weight: 400;
    line-height: 16.4px;
    margin: 0;
`

const LinksContainer = styled.div`
    width: 100%;
    display: flex;
    margin-top: 2rem;
`

const Link = styled.a`
    width: 40%;
    margin: 0 5%;
    color: ${white};
`


const Potvrzeni:FC<iPotvrzeni> = () => {
    return (
        <Container>
            <TextContainer>
                <WhiteText>
                        Děkujeme za vložení nálezu do aplikace.
                </WhiteText>
                <Title>
                    jehlomat
                </Title>
                <WhiteText>
                        nález bude zlikvidován terénním pracovníkem.
                </WhiteText>
            </TextContainer>
           <SecondaryButton text="ULOŽIT NÁZEV" />
           <LinksContainer>
            <Link>
                Chci zaslat potvrzení o likvidaci nález
            </Link>
            <Link>
                Chci nález zlikvidovat sám
            </Link>
           </LinksContainer>
        </Container>
    )
};

export default Potvrzeni;