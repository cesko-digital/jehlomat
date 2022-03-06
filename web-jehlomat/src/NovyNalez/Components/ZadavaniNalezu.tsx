import { FC } from 'react';
import styled from 'styled-components';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import { FormItem, FormWrapper } from '../../Components/Form/Form';
import TextInput from '../../Components/Inputs/TextInput/TextInput';
import { white } from '../../Components/Utils/Colors';
import { FormItemLabel } from '../../Components/Utils/Typography';
import { INovaJehla } from '../NovyNalezContainer';

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
            <FormWrapper>
                <FormItem>
                    <FormItemLabel>Počet jehel</FormItemLabel>
                    <TextInput name="count" type="number" value={syringeInfo.count} placeholder="Zadejte počet stříkaček" onChange={handleInputChange} fullWidth />
                </FormItem>
                <FormItem>
                    <FormItemLabel>Datum a čas nálezu</FormItemLabel>
                    <TextInput name="datetime" type="date" value={syringeInfo.datetime} onChange={handleInputChange} fullWidth/>
                </FormItem>
                <FormItem>
                    <FormItemLabel>Poznámky</FormItemLabel>
                    <TextInput name="info" type="text" value={syringeInfo.info} placeholder="Rozšiřující informace" onChange={handleInputChange} fullWidth/>
                </FormItem>
                <FormItem>
                    <FormItemLabel>Foto z místa nálezu</FormItemLabel>
                    <TextInput type="text" disabled placeholder="Tuto funkci brzy zpřístupníme" fullWidth/>
                </FormItem>
                <FormItem>
                    <PrimaryButton text="Dokončit" onClick={onSumbit} />
                </FormItem>
            </FormWrapper>
        </Container>
    );
};

export default ZadavaniNalezu;
