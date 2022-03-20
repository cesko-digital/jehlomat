import { StatisticsBox } from './StatisticsBox';
import * as S from './styles';
import * as TEXT from './text';
import SyringeAddIcon from '../../assets/icons/syringe-add.svg';
import UserIcon from '../../assets/icons/green-person-outline.svg';
import { Footer } from './Footer';
import { Title } from './Title';

export const DesktopContent = () => (
    <S.Container>
        <Title />
        <StatisticsBox />
        <S.GeneralInformationBox dangerouslySetInnerHTML={{ __html: TEXT.GENERAL_INFORMATION.text }} />
        <S.IconBox>
            <img src={SyringeAddIcon} alt="Icon of syringe" height={41} />
        </S.IconBox>
        <S.SubTitle>{TEXT.ANONYMOUS_REPORTING.title}</S.SubTitle>
        <S.AnonymousTextBox dangerouslySetInnerHTML={{ __html: TEXT.ANONYMOUS_REPORTING.text }} />
        <S.IconBox>
            <img src={UserIcon} alt="Icon of user" height={35} />
        </S.IconBox>
        <S.SubTitle>{TEXT.JEHLOMAT_FOR_ORGANIZATION.title}</S.SubTitle>
        <S.JehlomatForOrganizationTextBox dangerouslySetInnerHTML={{ __html: TEXT.JEHLOMAT_FOR_ORGANIZATION.text }} />
        <Footer />
    </S.Container>
);
