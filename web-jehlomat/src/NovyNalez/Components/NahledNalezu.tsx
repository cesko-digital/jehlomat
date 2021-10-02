import {FC} from 'react'
import styled from 'styled-components'
import {white, primary} from '../../Components/Utils/Colors'
import TextInput from '../../Components/Inputs/TextInput/TextInput'
import { FormItemLabel } from '../../Components/Utils/Typography'
import { FormWrapper, FormItem } from '../../Components/Form/Form'
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../Components/Buttons/SecondaryButton/SecondaryButton'
import TitleBar from '../../Components/Navigation/TitleBar'


const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    text-align: center;
    background-color: ${white};
    padding: 1rem;
`

const Link = styled.a`
    color: ${primary};
    text-size: 18px;
    margin: 1rem 0rem;
    text-decoration: none;
`

interface iNahledNalezu {
}

const NahledNalezu:FC<iNahledNalezu> = () => {
    return <Container>
            <TitleBar>
                <p>
                    3 icons navigation
                </p>
            </TitleBar>
            <FormWrapper>
            <FormItem>
                <FormItemLabel>
                    Počet jehel
                </FormItemLabel>
                <TextInput type="number" readOnly value="2"/>
            </FormItem>
            <FormItem>
                <FormItemLabel>
                    Místo nálezu
                </FormItemLabel>
                <TextInput type="text" readOnly value="Benešov - Ječna, 2"/>
            </FormItem>
            <SecondaryButton text="Zobrazit a upravit na mapě"/>
            <FormItem>
                <FormItemLabel>
                    Datum a čas nálezu
                </FormItemLabel>
                <TextInput type="date" readOnly value="04/15/2021"/>
            </FormItem>
            <FormItem>
                <FormItemLabel>
                    Poznámka k nálezu
                </FormItemLabel>
                <TextInput type="text" readOnly value="Zlomené"/>
            </FormItem>
            </FormWrapper>
            <PrimaryButton text="Uložit"/>
            <Link href="#">
                EDITOVAT NÁLEZ
            </Link>
        </Container>
};

export default NahledNalezu;