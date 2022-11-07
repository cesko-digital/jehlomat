import { FC, useEffect } from 'react';
import styled from '@emotion/styled';
import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { useRecoilValue, useRecoilState } from 'recoil';
import Link from 'Components/Link';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import imageSrc from 'assets/images/finish-line.svg';

import { primary, white, textSubTitles } from 'utils/colors';
import { fontFamilyRoboto } from 'utils/typography';
import { media } from 'utils/media';
import { LINKS } from 'routes';
import { isLoginValidState } from 'store/login';
import CheckIcon from 'assets/icons/check.svg';
import { SCheckIcon } from 'screens/RegistraceOrganizace/Dekujeme.styled';
import { MobileContainer, JehlomatLogoNoMargin } from 'Components/MobileComponents/MobileComponents';
import { newSyringeInfoState } from 'screens/Nalezy/NovyNalez/components/store';
import { isSyringeEdit } from '../components/types';
import { useHistory } from 'react-router';

interface PotvrzeniProps {
    trackingCode: string | null;
    teamAvailable: boolean;
}

interface TeamAvailableProps {
    teamAvailable: boolean;
}

interface TrackingCodeProps {
    trackingCode: string | null;
}

interface MobileLoggedInProps {
    isMobileLoggedIn?: boolean;
}

interface IsEditProps {
    isEdit: boolean;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: ${primary};
    padding: 1rem;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;

    @media ${media.gt('mobile')} {
        background-color: ${white};
        padding: 0 1rem 3rem;
        height: auto;
        position: static;
    }
`;

const TopText = styled.h1`
    ${fontFamilyRoboto}
    text-align: center;
    color: ${white};
    margin: 2rem 0;
    font-weight: 400;
    font-size: 18px;
    line-height: 1.25;

    @media ${media.gt('mobile')} {
        color: ${textSubTitles};
        font-size: 48px;
        font-weight: 300;
        margin: 1em 0;
    }
`;

const LoggedInMobileText = styled.p`
    ${fontFamilyRoboto}
    text-align: center;
    color: ${white};
    margin: 3rem 0;
    font-weight: 400;
    font-size: 24px;
    line-height: 1.5;
`;

const TrackingText = styled.p`
    ${fontFamilyRoboto}
    text-align: center;
    color: ${white};
    margin: 0;
    margin-bottom: 15px;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;

    @media ${media.gt('mobile')} {
        color: ${textSubTitles};
        font-weight: 300;
        line-height: 1.4;
    }
`;

const MessageParagraph = styled(TrackingText)`
    margin: 2em 0;
    padding: 0 2rem;
    max-width: 350px;
    font-size: 18px;
    font-weight: 400;

    @media ${media.gt('mobile')} {
        margin: 1em 0;
        padding: 0;
        max-width: 500px;
        font-size: 24px;
    }
`;

const TrackingCodeText = styled(TrackingText)`
    letter-spacing: 0.3em;
`;

const LinksContainer = styled.div`
    width: 100%;
    display: flex;
    margin-top: 2rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media ${media.gt('mobile')} {
        margin-top: 2rem;
    }
`;

const StyledLink = styled(Link)`
    width: 40%;
    margin: 0 5% 1rem;
    color: ${white};
    text-transform: uppercase;

    @media ${media.gt('mobile')} {
        color: ${primary};
    }
`;

const CheckIconBox: FC<MobileLoggedInProps> = ({ isMobileLoggedIn = false }) => (
    <Box py={isMobileLoggedIn ? 2 : 4} mb={isMobileLoggedIn ? 6 : 0}>
        <SCheckIcon>
            <img src={CheckIcon} alt="Jehlomat" />
        </SCheckIcon>
    </Box>
);

const MessageText: FC<TeamAvailableProps> = ({ teamAvailable }) => (
    <>{teamAvailable ? 'Nález bude zlikvidován terénním pracovníkem.' : 'V tomto místě nepůsobí terénní pracovníci, můžete nález zlikvidovat sami, nebo ho ohlásit na Městskou policii.'}</>
);

const TrackingCode: FC<TrackingCodeProps> = ({ trackingCode }) => {
    return (
        <>
            <Box>
                <TrackingText>Trasovací kód pro jeho sledování:</TrackingText>
                <TrackingCodeText>{trackingCode}</TrackingCodeText>
            </Box>
        </>
    );
};

const BackLink: FC<IsEditProps> = ({ isEdit }) => {
    const isDesktop = useMediaQuery(media.gt('mobile'));
    const Button = isDesktop ? PrimaryButton : SecondaryButton;

    return (
        <Link to={isEdit ? LINKS.FINDINGS : LINKS.HOME}>
            <Button text={isEdit ? 'Zpět na nálezy' : 'Zpět na domovskou stránku'} />
        </Link>
    );
};

const Links: FC<TeamAvailableProps> = ({ teamAvailable }) => {
    const isDesktop = useMediaQuery(media.gt('mobile'));
    const Button = isDesktop ? PrimaryButton : SecondaryButton;

    return (
        <LinksContainer>
            {teamAvailable && <BackLink isEdit={false} />}

            {!teamAvailable && (
                <>
                    <Link to={LINKS.FINDINGS_NOTIFY_POLICE}>
                        <Button text="Nález ohlásím městské policii" />
                    </Link>

                    <br />
                    <br />

                    <StyledLink to={LINKS.DISPOSAL_INSTRUCTIONS}>
                        Chci nález
                        <br /> zlikvidovat sám
                    </StyledLink>
                </>
            )}
        </LinksContainer>
    );
};

const Potvrzeni: FC<PotvrzeniProps> = ({ trackingCode, teamAvailable }) => {
    const history = useHistory();
    const isLoggedIn = useRecoilValue(isLoginValidState);
    const [newSyringeInfo] = useRecoilState(newSyringeInfoState);
    const isEdit = isSyringeEdit(newSyringeInfo);
    const isDesktop = useMediaQuery(media.gt('mobile'));

    useEffect(() => {
        if (isLoggedIn) {
            setTimeout(() => {
                history.push(LINKS.FINDINGS);
            }, 3000);
        }
    }, [isLoggedIn, history]);

    if (isLoggedIn) {
        if (isDesktop) {
            return (
                <Container>
                    <img src={imageSrc} height="285" alt="finish-line" />

                    <CheckIconBox />

                    <TopText>{isEdit ? 'Úprava nálezu byla úspěšná' : 'Vložení nálezu bylo úspěšné'}</TopText>

                    {teamAvailable && <TrackingCode trackingCode={trackingCode} />}
                    <br />
                    <br />
                    <BackLink isEdit={isEdit} />
                </Container>
            );
        } else {
            return (
                <MobileContainer>
                    <LoggedInMobileText>
                        Zvládli jste to!
                        <br />
                        <br />
                        Váš nález na
                    </LoggedInMobileText>

                    <JehlomatLogoNoMargin />

                    <LoggedInMobileText>{isEdit ? 'byl úspěšně upraven.' : 'byl zadán bez problémů!'}</LoggedInMobileText>

                    <CheckIconBox isMobileLoggedIn />

                    <BackLink isEdit={isEdit} />
                </MobileContainer>
            );
        }
    } else {
        if (isDesktop) {
            return (
                <Container>
                    <TopText>Děkujeme za vložení nálezu.</TopText>

                    <MessageParagraph>
                        <MessageText teamAvailable={teamAvailable} />
                    </MessageParagraph>

                    {teamAvailable && <TrackingCode trackingCode={trackingCode} />}

                    <Links teamAvailable={teamAvailable} />
                </Container>
            );
        } else {
            return (
                <MobileContainer>
                    <TopText>
                        Děkujeme za vložení nálezu
                        <br />
                        do aplikace
                    </TopText>

                    <JehlomatLogoNoMargin />

                    <CheckIconBox />

                    <MessageParagraph>
                        <MessageText teamAvailable={teamAvailable} />
                    </MessageParagraph>

                    {teamAvailable && <TrackingCode trackingCode={trackingCode} />}

                    <Links teamAvailable={teamAvailable} />
                </MobileContainer>
            );
        }
    }
};

export default Potvrzeni;
