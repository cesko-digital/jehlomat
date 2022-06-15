import { FC, InputHTMLAttributes, useState } from 'react';
import { default as MInput, TextFieldProps } from '@mui/material/TextField';
import styled from '@emotion/styled';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconWrapper } from './TextInput.style';
import { Label } from '../shared';

interface Props extends InputHTMLAttributes<HTMLInputElement>, Pick<TextFieldProps, 'multiline' | 'rows' | 'maxRows' | 'inputProps'> {
    label?: string;
    error?: string | undefined;
    fullWidth?: boolean;
    className?: string;
    width?: string;
}

const Container = styled.div`
    width: 100%;
    position: relative;
`;

const TextInput: FC<Props> = props => {
    const { type: propType, className, multiline, rows, maxRows, inputProps } = props;
    const [type, setType] = useState(propType || 'text');

    return (
        <Container className={className}>
            <Label htmlFor={props.name}>{props.label}</Label>
            <MInput
                id={props.id}
                variant="outlined"
                name={props.name}
                required={props.required}
                type={type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
                error={Boolean(props.error)}
                helperText={props.error}
                disabled={props.disabled}
                fullWidth={props.fullWidth ?? true}
                inputProps={{
                    ...inputProps,
                    style: {
                        ...inputProps?.style,
                        width: props.width,
                    },
                }}
                multiline={multiline}
                rows={rows}
                maxRows={maxRows}
            />
            {propType === 'password' && (
                <IconWrapper onClick={() => setType(type === 'text' ? 'password' : 'text')}>
                    <FontAwesomeIcon icon={type !== 'text' ? faEye : faEyeSlash} />
                </IconWrapper>
            )}
        </Container>
    );
};

export default TextInput;
