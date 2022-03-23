import { useMediaQuery } from '@mui/material';
import Container from '@mui/material/Container';
import { Header } from 'Components/Header/Header';
import { media } from 'utils/media';
import { DesktopContent } from './DesktopContent';
import { MobileContent } from './MobileContent';

const AboutPage = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    return (
        <>
            <Header mobileTitle="" />

            <Container
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                }}
            >
                {isMobile ? <MobileContent /> : <DesktopContent />}
            </Container>
        </>
    );
};

export default AboutPage;
