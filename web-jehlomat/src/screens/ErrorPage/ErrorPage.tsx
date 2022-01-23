import styled from '@emotion/styled';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { primary as bgColor, white as textColor } from '../../utils/colors';
import SecondaryButton from './../../components/Buttons/SecondaryButton/SecondaryButton';

const Container = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${textColor};
    background-color: ${bgColor};
`;

const InfoText = styled.div`
    margin-top: 2rem;
    margin-bottom: 2rem;
    display: flex;
    text-align: center;
`;

export default () => {
    return (
        <Container>
            <h2>Ups neco se pokazilo</h2>
            <ErrorOutline style={{ fill: 'Orange', fontSize: 80 }} />
            <InfoText>Máme neočekávaný problém, zkuste akci zopakovat!</InfoText>
            <SecondaryButton text="Zpět" onClick={() => history.back()} />
        </Container>
    );
};
