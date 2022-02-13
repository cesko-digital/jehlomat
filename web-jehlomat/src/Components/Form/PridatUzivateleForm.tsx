import { FC } from 'react';
import { Formik } from 'formik';
import { useMediaQuery } from '@mui/material';
import TextInput from '../Inputs/TextInput/TextInput';
import { FormItemLabel, FormItemDescription } from '../../utils/typography';
import { FormWrapper, FormItem } from '../Form/Form';
import PrimaryButton from '../Buttons/PrimaryButton/PrimaryButton';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';
import API from '../../config/baseURL';
import { AxiosResponse } from 'axios';
import * as yup from 'yup';
import styled from '@emotion/styled';
import { primaryDark } from '../../utils/colors';
import { media } from '../../utils/media';

interface Props {}

interface Values {
    email: string;
}

const validationSchema = yup.object({
    email: yup.string().email('Vlož validní email').required('Email je povinné pole'),
});

const ModalFormWrapper = styled(FormWrapper)<{ mobile?: boolean }>`
    ${props =>
        props.mobile &&
        `
        height: calc(100vh - 100px);
        justify-content: flex-start;
    `}
`;

const ModalFormItem = styled(FormItem)<{ mobile?: boolean }>`
    font-family: Roboto;
    margin: 15px 10px;
    text-align: center;
    width: 90%;

    @media (min-width: 700px) {
        width: 85%;
    }
    ${props =>
        props.mobile &&
        `
        width: 90%;
    `}

`;

const ModalFormItemLabel = styled(FormItemLabel)<{ mobile?: boolean }>`
    text-transform: none;
    ${props =>
        props.mobile &&
        `
        font-weight: 700;
        font-size: 18px;
        text-align: left;
    `}
`;

const ModalFormItemDescription = styled(FormItemDescription)<{ mobile?: boolean, below?: boolean }>`
    color: ${primaryDark};
    text-align: center;
    font-size: 18px;
    @media (min-width: 700px) {
        width: 85%;
    }
    ${props =>
        props.mobile &&
        `
        margin: 3rem 0;
        font-weight: 500;
        line-height: 24px;
        text-align: left;
        width: 90%;

    `}
    ${props =>
        (props.below && props.mobile) &&
        `
        font-size: 16px;
        margin: 0 0 2rem;
    `}
`;


const PridatUzivateleModal: FC<Props> = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    let history = useHistory();
    return (
        <>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values: Values, { setErrors }) => {
                    try {
                        const response: AxiosResponse<any> = await API.post('/api/v1/jehlomat/user', values);
                        const status = response.status;

                        switch (true) {
                            case /2[0-9][0-9]/g.test(status.toString()): {
                                history.push('/uzivatel/dekujeme');
                                break;
                            }
                            case status === 409: {
                                //for validation error;
                                setErrors({ email: response.data });
                                break;
                            }
                            default: {
                                //all others goes to error page; TODO push to error page
                                break;
                            }
                        }
                    } catch (error: any) {
                        console.log(error)
                        //link to error page
                    }
                }}
            >
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                    return (
                        <Box minHeight={'100vh'}>
                            <ModalFormWrapper mobile={isMobile} onSubmit={handleSubmit}>
                                <ModalFormItemDescription mobile={isMobile}>Vložte e-mailovou adresu a stiskněte tlačítko přidat.</ModalFormItemDescription>
                                <ModalFormItem>
                                    <ModalFormItemLabel mobile={isMobile}>Email uživatele</ModalFormItemLabel>
                                    <TextInput
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        type="text"
                                        name="email"
                                        placeholder="Email"
                                        required={true}
                                        error={touched.email && Boolean(errors.email) ? errors.email : undefined}
                                    />
                                </ModalFormItem>
                                <ModalFormItemDescription below mobile={isMobile}>Na danou adresu bude zaslán registrační odkaz pro nového uživatele.</ModalFormItemDescription>
                                <Box sx={{ mt: isMobile ? '9rem' : '3rem', mb: '1rem' }}>
                                    <PrimaryButton text="Přidat" type="submit" disabled={!isValid} />
                                </Box>
                            </ModalFormWrapper>
                        </Box>
                    );
                }}
            </Formik>
        </>
    );
};

export default PridatUzivateleModal;
