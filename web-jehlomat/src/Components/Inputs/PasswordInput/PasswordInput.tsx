import { FC, InputHTMLAttributes, useState } from 'react';
import styled from 'styled-components';
import { primaryDark, primaryLight } from '../../Utils/Colors';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PasswordInput extends InputHTMLAttributes<HTMLInputElement> {}

const Layout = styled.div`
    position: relative;
    width: 100%;
`;

const IconWrapper = styled.button`
    background-color: white;
    border: 0;
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: ${primaryDark};
`;

const Input = styled.input`
    height: 64px;
    width: 100%;
    max-width: 340px;
    padding: 0px 40px;
    width: 100%;

    border: 1px solid ${primaryDark};
    box-sizing: border-box;
    border-radius: 5px;

    :focus {
        outline: none;
    }
`;

const PasswordInput: FC<PasswordInput> = props => {
    const [show, setShow] = useState<boolean>(false);
    return (
        <Layout>
            <IconWrapper onClick={() => setShow(!show)}>
                <FontAwesomeIcon icon={show ? faEye : faEyeSlash} />
            </IconWrapper>
            <Input type={show ? 'text' : 'password'} {...props} />
        </Layout>
    );
};

export default PasswordInput;
