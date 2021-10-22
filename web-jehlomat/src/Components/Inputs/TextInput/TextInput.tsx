import { FC, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { primaryDark, grey, primary } from '../../Utils/Colors';
import InputLabel from '@material-ui/core/InputLabel';
import { default as MInput } from "@material-ui/core/TextField";
import AddIcon from '@material-ui/icons/add';

interface TextInput extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Label = styled.label`
{
    color: ${grey};
    display:block;
    padding-bottom: 5px;
    font-weight: bold;
    font-family: 'Roboto';
    font-size:10pt; 
}
`

const Input = styled.div`
    margin: 1em;
`;

const TextInput: FC<TextInput> = props => {
    return (
        <Input>
            <Label htmlFor={props.name}>{props.label}</Label>
            <MInput variant="outlined" name={props.name} type={props.type} required={props.required} placeholder={props.placeholder}/>
        </Input>
    )
};

export default TextInput;
