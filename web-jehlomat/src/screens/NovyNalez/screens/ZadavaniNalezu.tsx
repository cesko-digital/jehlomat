import { FC, useMemo } from 'react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';

import syringe from 'assets/icons/syringe.svg';
import event from 'assets/icons/event.svg';
import create from 'assets/icons/create.svg';

import { DateTimePicker } from 'Components/Inputs/DateTimePicker/DateTimePicker';

import { INovaJehla } from 'screens/NovyNalez/NovyNalezContainer';
import { white } from 'utils/colors';
import { FormItem, FormWrapper } from 'Components/Form/Form';
import { FormItemLabel } from 'utils/typography';
import TextInput from 'Components/Inputs/TextInput/TextInput';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import PhotoUpload from 'screens/NovyNalez/components/PhotoUpload';
import TextArea from 'Components/Inputs/TextArea';

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
    width: 100%;
`;

const Icon = styled.img<{readOnly?: boolean}>`
    position: absolute;
    right: 20px;
    bottom: 15px;
    height: 25px;
  
    ${({readOnly}) => readOnly && `
        opacity: .6;
    `}
`;

interface Props {
    onInputChange: (key: string, value: string | number) => void;
    syringeInfo: INovaJehla;
    readOnly?: boolean;
}

const ZadavaniNalezu: FC<Props> = ({ syringeInfo, onInputChange, readOnly, children }) => {
    const { info, datetime, count } = syringeInfo;
    const currentTime = useMemo(() => dayjs(), []);

    return (
        <>
            <Box minHeight={'100vh'} pt={4}>
                <Container>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormWrapper>
                                <FormItem>
                                    <FormItemLabel>Počet stříkaček</FormItemLabel>
                                    <TextInput
                                        type="number"
                                        value={count}
                                        placeholder="Zadejte počet stříkaček"
                                        onChange={e => onInputChange('count', e.target.value)}
                                        disabled={readOnly}
                                    />
                                    <Icon src={syringe} readOnly={readOnly} />
                                </FormItem>
                                <FormItem>
                                    <FormItemLabel>Datum a čas nálezu</FormItemLabel>
                                    {/*<TextInput type="date" value={datetime} onChange={e => onInputChange('datetime', e.target.value)} />*/}
                                    <DateTimePicker
                                        value={datetime || currentTime.unix()}
                                        maxDateTime={currentTime}
                                        onChange={newValue => {
                                            newValue && onInputChange('datetime', newValue);
                                        }}
                                        toolbarTitle="Vyberte datum a čas nálezu"
                                        disabled={readOnly}
                                    />
                                    <Icon src={event} readOnly={readOnly} />
                                </FormItem>
                                <FormItem>
                                    <FormItemLabel>Poznámky</FormItemLabel>
                                    <TextArea
                                        value={info}
                                        placeholder="Rozšiřující informace"
                                        onChange={e => onInputChange('info', e.target.value)}
                                        minRows={2}
                                        maxRows={30}
                                        disabled={readOnly}
                                    />
                                    <Icon src={create} readOnly={readOnly} />
                                </FormItem>
                                <FormItem>
                                    <FormItemLabel>Foto z místa nálezu</FormItemLabel>
                                    <PhotoUpload onChange={value => onInputChange('photo', value)} readOnly={readOnly} />
                                </FormItem>
                                <FormItem>
                                    <ButtonContainer>{children}</ButtonContainer>
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
