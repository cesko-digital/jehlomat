import { FC } from 'react';
import styled from '@emotion/styled';
import PrimaryButton from '../../../components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../../../components/Buttons/TextButton/TextButton';
import { FormItem, FormWrapper } from '../../../components/Form/Form';
import { Header } from '../../../components/Header/Header';
import TextInput from '../../../components/Inputs/TextInput/TextInput';
import { white } from '../../../utils/colors';
import { FormItemLabel } from '../../../utils/typography';

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
        <>
            <Header mobileTitle="Kontrola zadaných údajů o nálezu" />

            <Container>
                <FormWrapper>
                    <FormItem>
                        <FormItemLabel>Počet jehel</FormItemLabel>
                        <TextInput type="number" readOnly value={count} placeholder="Počet nebyl zadán" />
                    </FormItem>
                    <FormItem>
                        <FormItemLabel>Místo nálezu</FormItemLabel>
                        <TextInput type="text" readOnly value={`${lat}, ${lng}`} />
                    </FormItem>
                    <TextButton text="Zobrazit a upravit na mapě" onClick={onLocationChangeClick} />
                    <FormItem>
                        <FormItemLabel>Datum a čas nálezu</FormItemLabel>
                        <TextInput type="date" readOnly value={datetime} placeholder="Datum nebylo zadáno" />
                    </FormItem>
                    <FormItem>
                        <FormItemLabel>Poznámka k nálezu</FormItemLabel>
                        <TextInput type="text" readOnly value={info} placeholder="Poznámky nebyly zadány" />
                    </FormItem>
                </FormWrapper>
                <ButtonContainer>
                    <TextButton text="Editovat nález" onClick={onEditClick} />
                    <PrimaryButton text="Uložit" onClick={onSaveClick} />
                </ButtonContainer>
            </Container>
        </>
    );
};

export default NahledNalezu;
