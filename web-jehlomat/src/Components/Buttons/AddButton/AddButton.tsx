import { ButtonHTMLAttributes, FC } from 'react';
import styled from 'styled-components';
import { default as MIconButton } from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/add';
import { primary, white } from '../../Utils/Colors';

interface AddButton extends ButtonHTMLAttributes<HTMLButtonElement> { }

const IconButton = styled(MIconButton)`
&& {
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
}
`;


const AddButton: FC<AddButton> = ({ ...props }) => {
    return (
        <IconButton onClick={props.onClick}>
            <AddIcon style={{fill: `${primary}`}} fontSize="large" />
        </IconButton>
    );
};

export default AddButton;
