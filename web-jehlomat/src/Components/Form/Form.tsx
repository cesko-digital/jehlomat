import styled from 'styled-components';

export const Wrapper = styled.section`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FormWrapper = styled.form`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
`;

export const FormItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: center;
    text-align: flex-start;
    width: 80%;
    font-family: Roboto;
    margin: 10px;
`;
