import { ButtonHTMLAttributes, FC } from 'react';
import styled from '@emotion/styled';
import { primaryDark, white } from '../../../utils/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

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

const EditButton: FC<Props> = ({ ...props }) => {
    return (
        <Edit {...props}>
            <FontAwesomeIcon icon={faPencilAlt} size="1x" color={primaryDark} />
        </Edit>
    );
};

export default EditButton;
