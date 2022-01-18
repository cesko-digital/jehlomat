import { ButtonHTMLAttributes, FC } from 'react';
import styled from '@emotion/styled';
import { primary, primaryDark, white } from '../../../utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

interface EditButton extends ButtonHTMLAttributes<HTMLButtonElement> {}

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

const Edit = styled.button`
    display: flex;
    padding: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    border: none;
    border-radius: 100%;
    background-color: ${white};
    color: ${white};
    cursor: pointer;
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

const EditButton: FC<EditButton> = ({ ...props }) => {
    return (
        <Edit {...props}>
            <FontAwesomeIcon icon={faPencilAlt} size="1x" color={primaryDark} />
        </Edit>
    );
};

export default EditButton;
