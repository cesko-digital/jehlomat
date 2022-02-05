import { FC, InputHTMLAttributes, useState } from 'react';
import { grey } from '../../../utils/colors';
import { default as MInput } from '@mui/material/TextField';
import styled from '@emotion/styled';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconWrapper } from './TextInput.style';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | undefined;
    fullWidth?: boolean;
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

const Container = styled.div`
    width: 100%;
    position: relative;
`;

const TextInput: FC<Props> = props => {
    const { type: propType } = props;
    const [type, setType] = useState(propType || 'text');

    return (
        <Container>
            <Label htmlFor={props.name}>{props.label}</Label>
            <MInput
                id={props.id}
                variant="outlined"
                name={props.name}
                required={props.required}
                type={propType}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
                error={Boolean(props.error)}
                helperText={props.error}
                disabled={props.disabled}
                fullWidth={props.fullWidth ?? true}
            />
            {propType === 'password' && (
                <IconWrapper onClick={() => setType(type === 'text' ? 'password' : 'text')}>
                    <FontAwesomeIcon icon={type === 'text' ? faEye : faEyeSlash} />
                </IconWrapper>
            )}
        </Container>
    );
};

export default TextInput;
