import { FC, useState } from 'react';
import styled from '@emotion/styled';
import { INovaJehla } from '../NovyNalez';
import { white, primaryDark } from '../../../utils/colors';
import { FormItem, FormWrapper } from '../../../Components/Form/Form';
import { FormItemLabel } from '../../../utils/typography';
import TextInput from '../../../Components/Inputs/TextInput/TextInput';
import PrimaryButton from '../../../Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../../../Components/Buttons/TextButton/TextButton';
import { Header } from '../../../Components/Header/Header';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DatumCasLikvidaceNalezu from './DatumCasLikvidaceNalezu';
import DialogStyled from '../../../Components/Dialog/DialogStyled';

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
    onInputChange: (key: string, value: string) => void;
    onSumbit: () => void;
    syringeInfo: INovaJehla;
}

const ZadavaniNalezu: FC<Props> = ({ syringeInfo, onInputChange, onSumbit }) => {
    const { info, datetime, count } = syringeInfo;
    const [openDialog, setOpenDialog] = useState(false);

    const showDialog = (e: any) => {
        e.preventDefault(); // to avoid calendar popup opened
        setOpenDialog(true);
    };

    const hideDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <Header mobileTitle="Kontrola zadaných údajů o nálezu" />
            <DialogStyled open={openDialog} onClose={hideDialog}>
                <DatumCasLikvidaceNalezu onClose={hideDialog} />
            </DialogStyled>
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
                                    <ButtonContainer>
                                        <PrimaryButton text="Dokončit" onClick={onSumbit} />
                                    </ButtonContainer>
                                    <TextButton
                                        text="NÁLEZ SI REZERVUJU K POZDĚJŠÍ LIKVIDACI"
                                        type="button"
                                        onClick={e => showDialog(e)}
                                        fontSize="18px"
                                        color={primaryDark}
                                        underline
                                        fontWeight="500"
                                    />
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
