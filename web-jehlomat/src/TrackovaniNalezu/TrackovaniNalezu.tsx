import { FC } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import TextInput from '../Components/Inputs/TextInput/TextInput';
import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../Components/Buttons/TextButton/TextButton';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import API from '../config/baseURL';
import { AxiosResponse } from 'axios';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { primaryDark } from '../Components/Utils/Colors';

interface ITrackovaniNalezu {}

interface Values {
    kod: string;
}

const validationSchema = yup.object({
    heslo: yup.string().min(8, 'Trackovaí kód musí mít přesně 8 znaků.').required('Trackovací kód je povivnný.'),
});

const TrackovaniNalezu: FC<ITrackovaniNalezu> = ({}) => {
    let history = useHistory();

    return (
        <Container maxWidth="xs">
            <Box sx={{ height: '100vh' }}>
                <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                    <Grid container direction="column" justifyContent="center" alignItems="center">
                        <Typography align="center" variant="h5" color={primaryDark}>
                            Pro zobrazení stavu nálezu, zadejte prosím trasovací kód.
                        </Typography>
                        <Box sx={{ mt: '2rem' }}>
                            <Formik
                                initialValues={{ kod: '' }}
                                validationSchema={validationSchema}
                                onSubmit={async (values: Values, { setErrors }) => {
                                    try {
                                        const response: AxiosResponse<any> = await API.post('/api/v1/jehlomat/syringe', values);
                                        const status = response.status;

                                        // TODO
                                    } catch (error: any) {
                                        //link to error page
                                    }
                                }}
                            >
                                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                                    return (
                                        <Form onSubmit={handleSubmit}>
                                            <Grid container direction="column" justifyContent="center" alignItems="center">
                                                <TextInput
                                                    id="kod"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.kod}
                                                    type="text"
                                                    name="kod"
                                                    label="Trasovací kód nálezu"
                                                    required={true}
                                                    error={touched.kod && Boolean(errors.kod) ? errors.kod : undefined}
                                                />
                                                <Box sx={{ mt: '3rem', mb: '1rem' }}>
                                                    <PrimaryButton id="submit" text="Potvrdit" type="submit" disabled={!isValid} />
                                                </Box>
                                            </Grid>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </Box>
                        <TextButton text="Zpět" />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default TrackovaniNalezu;
