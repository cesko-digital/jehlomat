import { CollapsibleText } from 'Components/CollapsibleText';
import { Footer } from './Footer';
import { StatisticsBox } from './StatisticsBox';
import * as S from './styles';
import * as Text from './text';
import { Title } from './Title';

export const MobileContent = () => (
    <S.Container>
        <StatisticsBox />
        <Title />
        <CollapsibleText title={Text.GENERAL_INFORMATION.title} text={Text.GENERAL_INFORMATION.text} />
        <CollapsibleText title={Text.ANONYMOUS_REPORTING.title} text={Text.ANONYMOUS_REPORTING.text} />
        <CollapsibleText title={Text.JEHLOMAT_FOR_ORGANIZATION.title} text={Text.JEHLOMAT_FOR_ORGANIZATION.text} />
        <Footer />
    </S.Container>
);
