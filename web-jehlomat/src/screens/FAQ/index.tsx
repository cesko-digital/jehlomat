import { Header } from '../../Components/Header/Header';
import { primaryDark } from '../../utils/colors';
import { questions } from './questions';
import { StyledContainer } from './styles';
import { Typography, Container } from '@mui/material';
import { CollapsibleText } from 'Components/CollapsibleText';

const FAQPage = () => {
    return (
        <>
            <Header mobileTitle="" />
            <Container sx={{ marginTop: '100px', marginBottom: '50px' }}>
                <Typography align="left" variant="h1" color={primaryDark} fontSize="48px" lineHeight="56px" fontWeight="300" sx={{ mb: '26px' }}>
                    Otázky a odpovědi
                </Typography>
            </Container>
            <StyledContainer>
                {questions.map((question, key) => (
                    <CollapsibleText key={key} title={question.question} text={question.answer} />
                ))}
            </StyledContainer>
        </>
    );
};

export default FAQPage;
