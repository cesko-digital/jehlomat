import { FC } from 'react';
import styled from 'styled-components';
import { white } from '../../Components/Utils/Colors';
import TextInput from '../../Components/Inputs/TextInput/TextInput';
import { FormItemLabel } from '../../Components/Utils/Typography';
import { FormWrapper, FormItem } from '../../Components/Form/Form';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import TitleBar from '../../Components/Navigation/TitleBar';
import { Handler } from 'leaflet';
import { INovaJehla } from '../NovyNalez';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    text-align: center;
    background-color: ${white};
`;
interface IZadavaniNalezu {
    onInputChange: (key: string, value: string) => void;
    onSumbit: () => void;
    syringeInfo: INovaJehla;
}

const ZadavaniNalezu: FC<IZadavaniNalezu> = ({ syringeInfo, onInputChange, onSumbit }) => {
    const { lat, lng, info, datetime, count } = syringeInfo;
    return (
        <Container>
            <TitleBar>
                <p>Podrobnější informace o nálezu</p>
            </TitleBar>
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
    );
};

export default ZadavaniNalezu;
