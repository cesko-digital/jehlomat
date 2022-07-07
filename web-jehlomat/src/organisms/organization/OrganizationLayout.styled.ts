import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { primary, secondary, textSubTitles, white } from '../../utils/colors';
import { size } from '../../utils/spacing';

const ICON_SIZE = 14;

export const SStep = styled(Box)<{ active: boolean; initialStep?: boolean }>`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: ${size(2)};

    &:after {
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        position: absolute;
        top: calc(50% - ${size(ICON_SIZE / 4)} - ${size(2)});
        left: 50%;
        background: ${({ active }) => (active ? secondary : primary)};
        z-index: 1;
    }

    ${({ initialStep }) =>
        initialStep &&
        css`
            &:first-of-type {
                &:after {
                    background: ${primary};
                }
            }
        `}

    &:last-of-type {
        &:after {
            display: none;
        }
    }
`;

export const SIcon = styled.div<{ active: boolean; inverted?: boolean }>`
    min-width: ${size(ICON_SIZE)};
    min-height: ${size(ICON_SIZE)};
    width: ${size(ICON_SIZE)};
    height: ${size(ICON_SIZE)};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    background-color: ${({ active, inverted }) => (active ? (inverted ? white : secondary) : white)};
    border-radius: 50%;
    border: 2px solid ${({ active, inverted }) => (active ? (inverted ? secondary : white) : primary)};
    margin-bottom: ${size(2)};

    > img {
        width: ${size(7)};
    }
`;

export const SSubTitle = styled(Typography)`
    font-size: ${size(3)};
    color: ${textSubTitles};
    max-width: ${size(21)};
    text-align: center;
    line-height: ${size(4)};
`;

export const SContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
