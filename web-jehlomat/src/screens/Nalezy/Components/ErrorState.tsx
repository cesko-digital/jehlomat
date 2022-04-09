import React, { FunctionComponent } from 'react';
import { styled } from '@mui/system';
import { Bold, TextGold } from './Text';

interface EmptyStateProps {
    text: string;
}

const Content = styled('div')({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    justifyContent: 'center',
    height: '100%',
    paddingTop: 40,
});

const Vertical = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

    '& > *': {
        marginBottom: 16,
        textAlign: 'center',
    },
});

const ErrorState: FunctionComponent<EmptyStateProps> = ({ text, children }) => (
    <tr>
        <td colSpan={8}>
            <Content>
                <Vertical>
                    <TextGold>
                        <Bold>{text}</Bold>
                    </TextGold>
                    {children}
                </Vertical>
            </Content>
        </td>
    </tr>
);

export default ErrorState;
