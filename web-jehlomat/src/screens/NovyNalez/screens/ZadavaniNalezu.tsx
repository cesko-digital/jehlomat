import { FC, useMemo } from 'react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import syringe from 'assets/icons/syringe.svg';
import event from 'assets/icons/event.svg';
import create from 'assets/icons/create.svg';

import { DatePicker } from 'Components/Inputs/DatePicker/DatePicker';

import { INovaJehla } from 'screens/NovyNalez/NovyNalezContainer';
import { white } from 'utils/colors';
import { FormItem, FormWrapper } from 'Components/Form/Form';
import { FormItemLabel } from 'utils/typography';
import TextInput from 'Components/Inputs/TextInput/TextInput';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import PhotoUpload from 'screens/NovyNalez/components/PhotoUpload';
import TextArea from "Components/Inputs/TextArea";

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

const Icon = styled.img`
    position: absolute;
    right: 20px;
    bottom: 15px;
    height: 25px;
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
                                    <Icon src={syringe} />
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
                                    <Icon src={event} />
                                </FormItem>
                                <FormItem>
                                    <FormItemLabel>Poznámky</FormItemLabel>
                                    <TextArea
                                        value={info}
                                        placeholder="Rozšiřující informace"
                                        onChange={e => onInputChange('info', e.target.value)}
                                        minRows={2}
                                        maxRows={30}
                                    />
                                    <Icon src={create} />
                                </FormItem>
                                <FormItem>
                                    <FormItemLabel>Foto z místa nálezu</FormItemLabel>
                                    <PhotoUpload onChange={value => onInputChange('photo', value)} />
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
