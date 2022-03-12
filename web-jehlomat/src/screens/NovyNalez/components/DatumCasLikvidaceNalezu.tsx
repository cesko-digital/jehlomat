import { FC } from 'react';
import styled from '@emotion/styled';
import { media } from '../../../utils/media';
import PrimaryButton from '../../../Components/Buttons/PrimaryButton/PrimaryButton';
import { primary, primaryDark } from '../../../utils/colors';
import { FormItem, FormWrapper } from '../../../Components/Form/Form';
import DateInput from '../../../Components/Inputs/DateTimeInput/DateInput';
import TimeInput from '../../../Components/Inputs/DateTimeInput/TimeInput';
import TextButton from '../../../Components/Buttons/TextButton/TextButton';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';

type CloseFunction = () => void;

interface Props {
    onClose: CloseFunction;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    text-align: center;
    padding: 1rem;
`;

const TextContainer = styled.div`
    margin-bottom: 2rem;

    @media ${media.lte('mobile')} {
        margin-bottom: 0.5rem;
    }
`;

const Title = styled.h2`
    font-size: 24px;
    color: ${primary};
    font-weight: 300;
    text-align: center;
    margin: 1rem 0;

    @media ${media.lte('mobile')} {
        font-size: 14px;
        font-weight: 700;
        color: ${primaryDark};
    }
`;

const DatumCasLikvidaceNalezu: FC<Props> = ({ onClose }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <Container>
            <TextContainer>
                <Title>Vyberte prosím datum a čas likvidace nálezu</Title>
            </TextContainer>
            <FormWrapper horizontal>
                <FormItem style={{ alignItems: 'flex-end' }}>
                    {/* <FormItemLabel>Datum</FormItemLabel> */}
                    <DateInput label="Datum" type="date" value={'bb'} undertext="DD/MM/RR" />
                </FormItem>
                <FormItem style={{ alignItems: 'flex-start' }}>
                    <TimeInput label="Čas" type="time" value="2017-06-01" onChange={() => console.log('aj')} undertext="HH:MM" />
                </FormItem>
            </FormWrapper>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box mt={isMobile ? 2 : 4}>
                    <PrimaryButton fontSize="18px" text="REZERVOVAT NÁLEZ">
                        Chci nález zlikvidovat sám
                    </PrimaryButton>
                </Box>
                <Box mt={isMobile ? 3 : 4} mb={isMobile ? 0 : 6}>
                    <TextButton fontSize="18px" onClick={onClose} style={{ color: `${primaryDark}` }} text="ZPĚT NA NÁLEZ" type="button" />
                </Box>
            </Box>
        </Container>
    );
};

export default DatumCasLikvidaceNalezu;
