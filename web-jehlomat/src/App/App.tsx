import React, { FunctionComponent } from 'react';
import { Header } from '../Components/Header/Header';
import { Footer } from '../Components/Footer/Footer';
import { HeaderMobile } from '../Components/Header/HeaderMobile';
import { MaxMobileWidth } from '../Components/Utils/Constants';
import LandingPage from '../LandingPage';
import { Box } from '@mui/material';

class HelloJehlomat extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            width: window.innerWidth,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    renderPage() {
        const isMobile = window.innerWidth <= MaxMobileWidth;
        if (isMobile) {
            return <HeaderMobile />;
        } else {
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header />
                    <LandingPage />
                    <Footer />
                </Box>
            );
        }
    }

    render() {
        return this.renderPage();
    }
}

export default HelloJehlomat;
