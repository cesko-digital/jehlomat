import { IIconButon } from './types';
import styled from 'styled-components';

const Button = styled.button`
    border: none;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 28px;
    background-color: white;
    cursor: pointer;
    padding: 10px 16px;
    display: flex;
    align-items: center;
`;

const ButtonLabel = styled.label`
    margin-left: 12px;
    font-size: 14px;
    color: #898a8d;
    font-family: Roboto;
    font-weight: 400;
    cursor: pointer;
`;

const IconButton: React.FunctionComponent<IIconButon> = ({ text, leftElement, ...props }) => {
    return (
        <Button {...props}>
            {leftElement}
            <ButtonLabel>{text}</ButtonLabel>
        </Button>
    );
};

export default IconButton;
