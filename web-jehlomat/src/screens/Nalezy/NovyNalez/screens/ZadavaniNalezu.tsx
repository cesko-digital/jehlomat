import { FC, useMemo } from 'react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';

import syringe from 'assets/icons/syringe.svg';
import event from 'assets/icons/event.svg';
import create from 'assets/icons/create.svg';
import marker from 'assets/icons/marker.svg';

import { DateTimePicker } from 'Components/Inputs/DateTimePicker/DateTimePicker';

import { JehlaState } from 'screens/Nalezy/NovyNalez/components/types';
import { FormItem, FormWrapper } from 'Components/Form/Form';
import { FormItemLabel } from 'utils/typography';
import TextInput from 'Components/Inputs/TextInput/TextInput';
import PhotoUpload from 'screens/Nalezy/NovyNalez/components/PhotoUpload';
import TextArea from 'Components/Inputs/TextArea';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import { useRecoilState, useRecoilValue } from 'recoil';
import { newSyringeInfoErrorState, newSyringeInfoState } from 'screens/Nalezy/NovyNalez/components/store';
const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const Icon = styled.img<{ readOnly?: boolean; error?: boolean }>`
    position: absolute;
    right: 20px;
    bottom: 15px;
    height: 25px;

    ${({ readOnly }) =>
        readOnly &&
        `
        opacity: .6;
    `}

    ${({ error }) => error && `bottom: 37px;`}
`;

interface Props {
    onInputChange: (key: string, value: string | number) => void;
    syringeInfo: JehlaState;
    readOnly?: boolean;
    handleEditLocation?: () => void;
}

const ZadavaniNalezu: FC<Props> = ({ syringeInfo, onInputChange, readOnly, children, handleEditLocation }) => {
    const { info, datetime, count, lat, lng } = syringeInfo;
    const isMobile = useMediaQuery(media.lte('mobile'));
    const currentTime = useMemo(() => dayjs(), []);
    const { photo } = useRecoilValue(newSyringeInfoState);
    const decodedFiles = useMemo(() => photo && JSON.parse(photo), [photo]);
    const [newSyringeInfoError, setNewSyringeInfoError] = useRecoilState(newSyringeInfoErrorState);

    const validateSyringeCount = (value: string) => {
        if (!value || value.length === 0 || parseInt(value, 10) <= 0) {
            setNewSyringeInfoError({ ...newSyringeInfoError, count: 'Je nutné vyplnit počet stříkaček!' });
            onInputChange('count', value);
        } else {
            setNewSyringeInfoError({ ...newSyringeInfoError, count: undefined });
            onInputChange('count', value);
        }
    };

    return (
        <>
            <FormWrapper>
                <FormItem>
                    <FormItemLabel>Počet stříkaček</FormItemLabel>
                    <TextInput
                        required
                        disabled={readOnly}
                        error={newSyringeInfoError.count}
                        inputProps={{ min: 1 }}
                        placeholder="Zadejte počet stříkaček"
                        type="number"
                        value={count}
                        onChange={e => validateSyringeCount(e.target.value)}
                    />
                    <Icon src={syringe} readOnly={readOnly} error={!!newSyringeInfoError.count} />
                </FormItem>
                <FormItem>
                    <FormItemLabel>Datum a čas nálezu</FormItemLabel>
                    <DateTimePicker
                        required
                        value={datetime || currentTime.unix()}
                        maxDateTime={currentTime}
                        onChange={newValue => {
                            newValue && onInputChange('datetime', newValue);
                        }}
                        toolbarTitle="Vyberte datum a čas nálezu"
                        disabled={readOnly}
                    />
                    {isMobile && <Icon src={event} readOnly={readOnly} />}
                </FormItem>
                {readOnly && (
                    <>
                        <FormItem>
                            <FormItemLabel>Místo nálezu</FormItemLabel>
                            <TextInput type="text" value={`${lat?.toFixed(4)}, ${lng?.toFixed(4)}`} disabled={readOnly} />
                            <Icon src={marker} readOnly={readOnly} />
                        </FormItem>
                        {isMobile && (
                            <Box mt={2} mb={3} textAlign="center">
                                <SecondaryButton text="Zobrazit a upravit na mapě" onClick={handleEditLocation} />
                            </Box>
                        )}
                    </>
                )}
                <FormItem>
                    <FormItemLabel>Poznámky</FormItemLabel>
                    <TextArea value={info} placeholder="Rozšiřující informace" onChange={e => onInputChange('info', e.target.value)} minRows={2} maxRows={30} disabled={readOnly} />
                    <Icon src={create} readOnly={readOnly} />
                </FormItem>
                <FormItem>
                    <FormItemLabel>Foto z místa nálezu</FormItemLabel>
                    <PhotoUpload onChange={value => onInputChange('photo', value)} readOnly={readOnly} value={decodedFiles} />
                </FormItem>
                <FormItem>
                    <ButtonContainer>{children}</ButtonContainer>
                </FormItem>
            </FormWrapper>
        </>
    );
};

export default ZadavaniNalezu;
