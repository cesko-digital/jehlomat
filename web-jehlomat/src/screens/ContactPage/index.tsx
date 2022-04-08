import { Typography, Grid, Container } from '@mui/material';
import { Header } from '../../Components/Header/Header';
import { darkGrey, primaryDark, black } from '../../utils/colors';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { StyledLink, StyledTypography } from './styles';

const ContactPage = () => {
    return (
        <>
            <Header mobileTitle="" />

            <Container
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <Grid xs={9} alignItems="start" container direction="column" justifyContent="center">
                    <StyledTypography align="left" variant="h1" color={primaryDark} fontSize="48px" lineHeight="56px" fontWeight="300" sx={{ mb: '26px' }}>
                        Kontakt
                    </StyledTypography>
                    <StyledTypography align="left" variant="body1" color={darkGrey} fontSize="18px" lineHeight="21px" sx={{ mb: '43px' }}>
                        <MailOutlinedIcon sx={{ mr: '12px' }} />
                        <StyledLink href="mailto:info@jehlomat.cz">info@jehlomat.cz</StyledLink>
                    </StyledTypography>
                    <Typography align="left" variant="body1" color={black} fontSize="18px" lineHeight="21px" fontWeight={700} sx={{ mb: '10px' }}>
                        Mgr. Jiří Zatřepálek, odborný ředitel
                    </Typography>
                    <StyledTypography align="left" variant="body1" color={darkGrey} fontSize="18px" lineHeight="21px" sx={{ mb: '10px' }}>
                        <PhoneOutlinedIcon sx={{ mr: '12px' }} />
                        739 308 401
                    </StyledTypography>
                    <StyledTypography align="left" variant="body1" color={darkGrey} fontSize="18px" lineHeight="21px" sx={{ mb: '10px' }}>
                        <MailOutlinedIcon sx={{ mr: '12px' }} />
                        <StyledLink href="mailto:zatrepalek@magdalena-ops.cz">zatrepalek@magdalena-ops.cz</StyledLink>
                    </StyledTypography>
                    <Typography align="left" variant="body1" color={darkGrey} fontSize="18px" lineHeight="21px" sx={{ mb: '35px' }}>
                        <StyledLink href="http://www.magdalena-ops.eu/cz/">magdalena-ops.cz</StyledLink>
                    </Typography>
                    <Typography align="left" variant="body1" color={darkGrey} fontSize="18px" lineHeight="21px">
                        Autorem nápadu na vznik interaktivní mapy je Tomáš Žák z organizace <StyledLink href="https://www.laxus.cz">laxus.cz</StyledLink>.<br />
                        Děkujeme jemu a všem z komunity <StyledLink href="https://cesko.digital/">Česko.Digital</StyledLink>, kteří se podíleli na vzniku Jehlomatu.
                    </Typography>
                </Grid>
            </Container>
        </>
    );
};

export default ContactPage;
