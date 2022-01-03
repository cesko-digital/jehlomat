import { ICardTitle } from './types';
import styled from 'styled-components';
import { primaryDark } from '../../../Components/Utils/Colors';

const Title = styled.p`
    font-size: 16px;
    font-family: Roboto;
    font-weight: 500;
    line-height: 18.75px;
    text-align: center;
    color: ${primaryDark};
    margin: 0;
    padding: 0;
`;

const CardTitle: React.FunctionComponent<ICardTitle> = ({ text }) => {
    return <Title>{text}</Title>;
};

export default CardTitle;
