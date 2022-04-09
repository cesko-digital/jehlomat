import React, { FunctionComponent } from 'react';
import empty from 'assets/images/empty-state.svg';
import { ReactComponent as Empty } from 'assets/images/empty-state.svg';
import { styled } from '@mui/system';
import { Bold, TextHighlight, TextMuted } from './Text';

interface EmptyStateProps {
    text: string;
    description: string;
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

const EmptyStateImage = styled(Empty)({
    height: 220,
    width: 300,
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

const EmptyState: FunctionComponent<EmptyStateProps> = ({ text, description, children }) => (
    <tr>
        <td colSpan={8}>
            <Content>
                <EmptyStateImage />
                <Vertical>
                    <TextHighlight>
                        <Bold>{text}</Bold>
                    </TextHighlight>
                    <TextMuted>{description}</TextMuted>
                    {children}
                </Vertical>
            </Content>
        </td>
    </tr>
);

export default EmptyState;
