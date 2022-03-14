import { FC } from 'react';
import TextareaAutosize, { TextareaAutosizeProps } from '@mui/material/TextareaAutosize';

import styled from '@emotion/styled';

import { Label } from '../shared';
import { primary } from 'utils/colors';

interface Props extends TextareaAutosizeProps {
    label?: string;
}

const Container = styled.div`
    width: 100%;
    position: relative;

    textarea {
        // field doesn't resize as expected with border-box sizing, so this is hackish way of handling full width
        width: calc(100% - 33px);
        font: inherit;
        letter-spacing: inherit;
        color: currentColor;
        background: none;
        margin: 0;
        margin-top: 1px;
        display: block;
        min-width: 0;
        padding: 16.5px 14px;
        border: 1px solid rgba(0, 0, 0, 0.23);
        border-radius: 4px;
        
        &:focus {
            margin-top: 0;
            border: 2px solid ${primary};
            outline: none;
        }
    }
`;

export const TextArea: FC<Props> = props => {
    const { className, label, ...textAreaProps } = props;

    return (
        <Container className={className}>
            <Label htmlFor={props.name}>{label}</Label>

            <TextareaAutosize {...textAreaProps} />
        </Container>
    );
};

export default TextArea;
