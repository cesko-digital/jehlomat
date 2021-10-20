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
    const handleInputChange = (e: any) => {
        onInputChange(e.target.name, e.target.value);
    };
    return (
        <Container>
            <TitleBar>
                <p>Podrobnější informace o nálezu</p>
            </TitleBar>
            <FormWrapper>
                <FormItem>
                    <FormItemLabel>Počet jehel</FormItemLabel>
                    <TextInput name="count" type="number" value={syringeInfo.count} placeholder="Zadejte počet stříkaček" onChange={handleInputChange} />
                </FormItem>
                <FormItem>
                    <FormItemLabel>Datum a čas nálezu</FormItemLabel>
                    <TextInput name="datetime" type="date" value={syringeInfo.datetime} onChange={handleInputChange} />
                </FormItem>
                <FormItem>
                    <FormItemLabel>Poznámky</FormItemLabel>
                    <TextInput name="info" type="text" value={syringeInfo.info} placeholder="Rozšiřující informace" onChange={handleInputChange} />
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
