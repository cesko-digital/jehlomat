import React, { FunctionComponent } from 'react';
import PrimaryButton from "../Components/Buttons/PrimaryButton/PrimaryButton";
import StoryBook from "../Components/StoryBook";
import { Header } from '../Components/Header/Header';
import { Footer } from '../Components/Footer/Footer';
import { HeaderMobile } from '../Components/Header/HeaderMobile';
import { ValidationMap } from 'prop-types';
import { MaxMobileWidth } from '../Components/Utils/Constants';

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
            return (
                <HeaderMobile />
            )
        } else {
            return (<>
                <Header />
                <h3>Hello Jehlomat</h3>
                <StoryBook/>
                <Footer />
                </>
            )
        }
    }

    render(){
        return this.renderPage();
    }

}

export default HelloJehlomat;
