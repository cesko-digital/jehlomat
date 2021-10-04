import { FC, InputHTMLAttributes, useState } from 'react';
import styled from 'styled-components';
import { primaryDark, primaryLight, white } from '../../Utils/Colors';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PasswordInput extends InputHTMLAttributes<HTMLInputElement> {}

const Container = styled.div``;

const Input = styled.input`
    height: 64px;
    width: 100%;
    max-width: 340px;
    padding: 0px 15px;

    border: 1px solid ${primaryDark};
    box-sizing: border-box;
    border-radius: 5px;

    :focus {
        outline: none;
    }
`;

const IconWrapper = styled.button`
    flex: 0 0;
    background-color: ${white};
    border: none;
    position: absolute;
    top: 38%;
    right: 16%;
`;

const PasswordInput: FC<PasswordInput> = props => {
    const [show, setShow] = useState<boolean>(false);
    return (
        <Container>
            <Input type={show ? 'text' : 'password'} {...props} />
            <IconWrapper onClick={() => setShow(!show)}>
                <FontAwesomeIcon icon={show ? faEye : faEyeSlash} />
            </IconWrapper>
        </Container>
    );
};

export default PasswordInput;
