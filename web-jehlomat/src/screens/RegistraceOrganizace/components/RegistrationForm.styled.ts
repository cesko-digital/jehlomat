import styled from '@emotion/styled';
import TextInput from 'Components/Inputs/TextInput';
import { secondaryColorVariant, white } from 'utils/colors';
import { size } from 'utils/spacing';
import Link from 'Components/Link';
import { media } from 'utils/media';

export const SContainer = styled.div`
    border-radius: ${size(3)};

    width: 100%;
    max-width: ${size(166 - 30 * 2)};
    min-width: ${size(40)};

    @media ${media.gt('mobile')} {
        background-color: ${secondaryColorVariant('full')};
        padding: ${size(8)} ${size(13)};
        color: ${white};
    }
`;

export const STextInput = styled(TextInput)`
    label {
        margin-bottom: ${size(2)};
        display: block;

        @media ${media.gt('mobile')} {
            color: ${white};
        }
    }

    span {
        top: ${size(11)};
    }

    @media ${media.gt('mobile')} {
        input {
            border-radius: 5px;
            height: ${size(5)};
            background-color: #ffffff38;
            color: ${white};
        }

        fieldset {
            border-color: transparent;
        }

        svg {
            color: ${white};
        }
    }
`;

export const SBackLink = styled(Link)`
    margin-top: ${size(4)};
    color: ${white};

    @media ${media.lte('mobile')} {
        display: none;
    }
`;
