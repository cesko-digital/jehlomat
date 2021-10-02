import { FC } from 'react';
import styled from 'styled-components';
import { white } from '../../Components/Utils/Colors';
import TextInput from '../../Components/Inputs/TextInput/TextInput';
import { FormItemLabel } from '../../Components/Utils/Typography';
import { FormWrapper, FormItem } from '../../Components/Form/Form';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import TitleBar from '../../Components/Navigation/TitleBar';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    text-align: center;
    background-color: ${white};
    padding: 1rem;
`;
interface IZadavaniNalezu {}

const ZadavaniNalezu: FC<IZadavaniNalezu> = () => {
    return (
        <Container>
            <TitleBar>
                <p>Podrobnější informace o nálezu</p>
            </TitleBar>
            <FormWrapper>
                <FormItem>
                    <FormItemLabel>Počet jehel</FormItemLabel>
                    <TextInput type="number" placeholder="Zadejte počet stříkaček" />
                </FormItem>
                <FormItem>
                    <FormItemLabel>Datum a čas nálezu</FormItemLabel>
                    <TextInput type="date" />
                </FormItem>
                <FormItem>
                    <FormItemLabel>Poznámky</FormItemLabel>
                    <TextInput type="text" />
                </FormItem>
                <FormItem>
                    <FormItemLabel>Foto z místa nálezu</FormItemLabel>
                    <TextInput type="text" />
                </FormItem>
            </FormWrapper>
            <PrimaryButton text="Dokončit" />
        </Container>
    );
};

export default ZadavaniNalezu;
