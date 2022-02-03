import { FC } from 'react';
import styled from '@emotion/styled';
import { INovaJehla } from '../NovyNalez';
import { white } from '../../../utils/colors';
import { FormItem, FormWrapper } from '../../../Components/Form/Form';
import { FormItemLabel } from '../../../utils/typography';
import TextInput from '../../../Components/Inputs/TextInput/TextInput';
import PrimaryButton from '../../../Components/Buttons/PrimaryButton/PrimaryButton';
import { Header } from '../../../Components/Header/Header';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    text-align: center;
    background-color: ${white};
`;

interface Props {
    onInputChange: (key: string, value: string) => void;
    onSumbit: () => void;
    syringeInfo: INovaJehla;
}

const ZadavaniNalezu: FC<Props> = ({ syringeInfo, onInputChange, onSumbit }) => {
    const { info, datetime, count } = syringeInfo;

    return (
        <>
            <Header mobileTitle="Kontrola zadaných údajů o nálezu" />

            <Container>
                <FormWrapper>
                    <FormItem>
                        <FormItemLabel>Počet jehel</FormItemLabel>
                        <TextInput type="number" value={count} placeholder="Zadejte počet stříkaček" onChange={e => onInputChange('count', e.target.value)} />
                    </FormItem>
                    <FormItem>
                        <FormItemLabel>Datum a čas nálezu</FormItemLabel>
                        <TextInput type="date" value={datetime} onChange={e => onInputChange('datetime', e.target.value)} />
                    </FormItem>
                    <FormItem>
                        <FormItemLabel>Poznámky</FormItemLabel>
                        <TextInput type="text" value={info} placeholder="Rozšiřující informace" onChange={e => onInputChange('info', e.target.value)} />
                    </FormItem>
                    <FormItem>
                        <FormItemLabel>Foto z místa nálezu</FormItemLabel>
                        <TextInput type="text" disabled placeholder="Tuto funkci brzy zpřístupníme" />
                    </FormItem>
                    <FormItem>
                        <PrimaryButton text="Dokončit" onClick={onSumbit} />
                    </FormItem>
                </FormWrapper>
            </Container>
        </>
    );
};

export default ZadavaniNalezu;
