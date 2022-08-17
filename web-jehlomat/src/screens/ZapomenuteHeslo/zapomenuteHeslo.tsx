import { Box, Grid } from '@mui/material';
import { AxiosResponse } from 'axios';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import TextInput from 'Components/Inputs/TextInput';
import Modal from 'Components/Modal/Modal';
import API from 'config/baseURL';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router';
import { LINKS } from 'routes';
import apiURL from 'utils/api-url';
import * as yup from 'yup';

interface IValues {
    email: string;
}

interface IResponse {
    status?: string;
}

const validationSchema = yup.object({
    email: yup.string().email('Vlož validní email').required('Email je povinné pole'),
});

const ZapomenuteHeslo = () => {
    const history = useHistory();

    const onSubmit = async (values: IValues) => {
        try {
            const response: AxiosResponse<IResponse> = await API.post(apiURL.sendResetPassword, { email: values.email });
            if (response.status !== 204) {
                throw new Error();
            }
            history.push(LINKS.FORGOTTEN_PASSWORD_SUCCESS);
        } catch (error: any) {
            history.push(LINKS.ERROR);
        }
    };

    return (
        <Modal open={true} onClose={() => history.push('/')}>
            <Grid container direction="column" sx={{ height: 'auto', width: '100%', padding: '20px' }} justifyContent="start" alignItems="center">
                <Formik initialValues={{ email: '' }} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                        return (
                            <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                <TextInput
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    type="email"
                                    name="email"
                                    placeholder="E-mail"
                                    label="E-mail"
                                    required={true}
                                    error={touched.email && Boolean(errors.email) ? errors.email : undefined}
                                />
                                <Box justifyContent="center" sx={{ marginTop: '70px', display: 'flex' }}>
                                    <PrimaryButton id="submit" text="RESETOVAT HESLO" type="submit" />
                                </Box>
                            </Form>
                        );
                    }}
                </Formik>
            </Grid>
        </Modal>
    );
};

export default ZapomenuteHeslo;
