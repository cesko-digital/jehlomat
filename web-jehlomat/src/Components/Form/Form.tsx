import styled from '@emotion/styled';

export const Wrapper = styled.section`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FormWrapper = styled.form`
    display: flex;
    align-items: stretch;
    flex-direction: column;
    width: 100%;
`;

export const FormItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: center;
    text-align: left;
    
    font-family: Roboto;
    margin: 15px 6px;
    position: relative;
  
    @media (min-width: 420px) {
        align-items: center;
        width: 100%;
    }
    @media (min-width: 700px) {
        align-items: center;
        width: 340px;
    }
`;
