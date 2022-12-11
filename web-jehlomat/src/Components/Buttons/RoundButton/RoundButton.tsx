import styled from '@emotion/styled';
import { lightGreen } from 'utils/colors';

const StyledButton = styled.button`
    width: 56px;
    height: 56px;
    background-color: ${lightGreen};
    border-radius: 100%;
    outline: none;
    border: none;
`;

interface RoundButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

const RoundButton: React.FC<RoundButtonProps> = ({ onClick, children }) => <StyledButton onClick={onClick}>{children}</StyledButton>;

export default RoundButton;
