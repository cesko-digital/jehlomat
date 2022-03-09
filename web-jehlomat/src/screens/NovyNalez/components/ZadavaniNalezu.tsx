import { FC, useMemo } from 'react';
import styled from '@emotion/styled';
import { DatePicker } from 'Components/Inputs/DatePicker/DatePicker';

import { INovaJehla } from '../NovyNalezContainer';
import { white } from '../../../utils/colors';
import { FormItem, FormWrapper } from '../../../Components/Form/Form';
import { FormItemLabel } from '../../../utils/typography';
import TextInput from '../../../Components/Inputs/TextInput/TextInput';
import PrimaryButton from '../../../Components/Buttons/PrimaryButton/PrimaryButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    text-align: center;
    background-color: ${white};
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
`;

interface Props {
    onInputChange: (key: string, value: string | number) => void;
    onSumbit: () => void;
    syringeInfo: INovaJehla;
}

const ZadavaniNalezu: FC<Props> = ({ syringeInfo, onInputChange, onSumbit }) => {
    const { info, datetime, count } = syringeInfo;
    const currentTime = useMemo(() => dayjs(), []);

    return (
        <>
            <Box minHeight={'100vh'}>
                <Container>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormWrapper>
                                <FormItem>
                                    <FormItemLabel>Počet stříkaček</FormItemLabel>
                                    <TextInput type="number" value={count} placeholder="Zadejte počet stříkaček" onChange={e => onInputChange('count', e.target.value)} />
                                </FormItem>
                                <FormItem>
                                    <FormItemLabel>Datum a čas nálezu</FormItemLabel>
                                    {/*<TextInput type="date" value={datetime} onChange={e => onInputChange('datetime', e.target.value)} />*/}
                                    <DatePicker
                                        value={datetime || currentTime.unix()}
                                        maxDateTime={currentTime}
                                        onChange={newValue => {
                                            newValue && onInputChange('datetime', newValue);
                                        }}
                                        toolbarTitle="Vyberte datum a čas nálezu"
                                    />
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
                                    <ButtonContainer>
                                        <PrimaryButton text="Dokončit" onClick={onSumbit} />
                                    </ButtonContainer>
                                </FormItem>
                            </FormWrapper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default ZadavaniNalezu;
