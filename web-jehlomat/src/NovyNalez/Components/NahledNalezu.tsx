import { FC } from 'react';
import styled from 'styled-components';
import { white, primary } from '../../Components/Utils/Colors';
import TextInput from '../../Components/Inputs/TextInput/TextInput';
import { FormItemLabel } from '../../Components/Utils/Typography';
import { FormWrapper, FormItem } from '../../Components/Form/Form';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../Components/Buttons/SecondaryButton/SecondaryButton';
import TitleBar from '../../Components/Navigation/TitleBar';
import TextButton from '../../Components/Buttons/TextButton/TextButton';
import { INovaJehla } from '../NovyNalez';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    text-align: center;
    background-color: ${white};
`;

const ButtonContainer = styled.div`
    margin: auto;
    display: flex;
    width: 90%;
    justify-content: space-between;
    margin-top: 18px;
`;

interface INahledNalezu {
    syringeInfo: INovaJehla;
    onSaveClick: () => void;
    onEditClick: () => void;
    onLocationChangeClick: () => void;
}

const NahledNalezu: FC<INahledNalezu> = ({ syringeInfo, onEditClick, onLocationChangeClick, onSaveClick }) => {
    const { lat, lng, datetime, info, count } = syringeInfo;
    return (
        <Container>
            <TitleBar>
                <p>Kontrola zadaných údajů o nálezu</p>
            </TitleBar>
            <FormWrapper>
                <FormItem>
                    <FormItemLabel>Počet jehel</FormItemLabel>
                    <TextInput type="number" readOnly value={count} placeholder="Nezadali jste počet" />
                </FormItem>
                <FormItem>
                    <FormItemLabel>Místo nálezu</FormItemLabel>
                    <TextInput type="text" readOnly value={`${lat}, ${lng}`} />
                </FormItem>
                <TextButton text="Zobrazit a upravit na mapě" onClick={onLocationChangeClick} />
                <FormItem>
                    <FormItemLabel>Datum a čas nálezu</FormItemLabel>
                    <TextInput type="date" readOnly value={datetime} placeholder="Nezadali jste datum" />
                </FormItem>
                <FormItem>
                    <FormItemLabel>Poznámka k nálezu</FormItemLabel>
                    <TextInput type="text" readOnly value={info} placeholder="Nezadali jste poznámky" />
                </FormItem>
            </FormWrapper>
            <ButtonContainer>
                <TextButton text="Editovat nález" onClick={onEditClick} />
                <PrimaryButton text="Uložit" onClick={onSaveClick} />
            </ButtonContainer>
        </Container>
    );
};

export default NahledNalezu;
