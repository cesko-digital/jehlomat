import { FC, InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { grey } from '../../../utils/colors';
import { default as MInput } from '@mui/material/TextField';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | undefined;
}

const Label = styled.label`
     {
        color: ${grey};
        display: block;
        padding-bottom: 5px;
        font-weight: bold;
        font-family: 'Roboto';
        font-size: 10pt;
    }
`;

const Input = styled.div`
    margin: 1em;
`;

const TextInput: FC<Props> = props => {
    return (
        <Input>
            <Label htmlFor={props.name}>{props.label}</Label>
            <MInput
                id={props.id}
                variant="outlined"
                name={props.name}
                type={props.type}
                required={props.required}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
                error={Boolean(props.error)}
                helperText={props.error}
                disabled={props.disabled}
            />
        </Input>
    );
};

export default TextInput;
