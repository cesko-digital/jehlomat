import { ButtonHTMLAttributes, FC } from 'react';
import styled from 'styled-components';
import { primary, white } from '../../Utils/Colors';

interface AddButton extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = styled.button`
    position: relative;
    display: inline-block;
    vertical-align: middle;

    height: 48px;
    width: 48px;
    border: solid 4.4px ${primary};
    border-radius: 100%;
    background-color: ${white};
    color: ${white};
    cursor: pointer;
    padding: 0px 20px;
`;

const Plus = styled.div`
    :before,
    :after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${primary};
    }
    :before {
        width: 4px;
        margin: 8px auto;
    }
    :after {
        margin: auto 8px;
        height: 4px;
    }
`;

const AddButton: FC<AddButton> = ({ ...props }) => {
    return (
        <Button {...props}>
            <Plus />
        </Button>
    );
};

export default AddButton;
