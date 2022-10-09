import { FC } from 'react';
import styled from '@emotion/styled';
import TextInput from 'Components/Inputs/TextInput';
import Box from '@mui/material/Box';
import { Formik } from 'formik';
import { AxiosResponse } from 'axios';
import { API } from '../../config/baseURL';
import PrimaryButton from '../Buttons/PrimaryButton/PrimaryButton';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { FormItem, FormWrapper } from 'Components/Form/Form';
import { FormItemDescription, FormItemLabel } from 'utils/typography';
import { media } from 'utils/media';
import { useMediaQuery } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { tokenState } from 'store/login';
import apiURL from 'utils/api-url';

interface Props {}

interface Values {
    email: string;
}

const validationSchema = yup.object({
    email: yup.string().email('Vlož validní email').required('Email je povinné pole'),
});

const TextNewline = styled.br<{ mobile: boolean }>`
    display: ${props => (props.mobile ? 'none' : 'block')};
`;

const AddUserForm: FC<Props> = () => {
    const history = useHistory();
    const isMobile = useMediaQuery(media.lte('mobile'));
    const token = useRecoilValue(tokenState);

    return (
        <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values: Values, { setErrors }) => {
                if (token) {
                    try {
                        const response: AxiosResponse<any> = await API.post(apiURL.user, values);
                        const status = response.status;

                        switch (true) {
                            case /2[0-9][0-9]/g.test(status.toString()): {
                                history.push(`/uzivatel/validace/${values.email}`);
                                break;
                            }
                            case status === 409: {
                                //for validation error;
                                setErrors({ email: response.data });
                                break;
                            }
                            default: {
                                history.push('/error');
                                break;
                            }
                        }
                    } catch (error: any) {
                        history.push('/error');
                    }
                } else {
                    history.push('/error');
                }
            }}
        >
            {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                return (
                    <FormWrapper onSubmit={handleSubmit}>
                        <FormItemDescription green>Vložte e-mailovou adresu a stiskněte tlačítko přidat.</FormItemDescription>
                        <FormItem>
                            <FormItemLabel disableUppercase>Email uživatele</FormItemLabel>
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
                        </FormItem>
                        <FormItemDescription green sm>
                            Na danou adresu bude zaslán registrační odkaz <TextNewline mobile={isMobile} /> pro nového uživatele.
                        </FormItemDescription>
                        <Box sx={{ mt: isMobile ? '9rem' : '3rem', mb: '1rem' }}>
                            <PrimaryButton text="Přidat" type="submit" disabled={!isValid} />
                        </Box>
                    </FormWrapper>
                );
            }}
        </Formik>
    );
};

export default AddUserForm;
