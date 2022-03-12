import styled from '@emotion/styled';
import { media } from 'utils/media';

export const Wrapper = styled.section`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FormWrapper = styled.form<{ horizontal?: boolean }>`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;

    ${props =>
        props.horizontal &&
        `
        flex-direction: row;

        @media ${media.lte('mobile')} {
            flex-direction: row;
        }
        `}
`;

export const FormItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: center;
    text-align: left;
    width: 80%;
    font-family: Roboto;
    margin: 10px;
    @media (min-width: 420px) {
        align-items: center;
        width: 50%;
    }
    @media (min-width: 700px) {
        align-items: center;
        width: 340px;
    }
`;
