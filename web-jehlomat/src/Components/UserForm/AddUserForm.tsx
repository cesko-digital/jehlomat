import { FC, useContext } from 'react';
import TextInput from 'Components/Inputs/TextInput';

import { Form, Formik } from 'formik';
import { AxiosResponse } from 'axios';
import { authorizedAPI } from '../../config/baseURL';
import PrimaryButton from '../Buttons/PrimaryButton/PrimaryButton';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { FormItem } from 'Components/Form/Form';
import { FormItemDescription, FormItemLabel } from 'utils/typography';
import { LoginContext } from 'utils/login';

interface Props { }
interface Values {
    email: string;
}

const validationSchema = yup.object({
    email: yup.string().email('Vlož validní email').required('Email je povinné pole'),
});

const PridatUzivatele: FC<Props> = () => {
    const history = useHistory();
    const { token } = useContext(LoginContext);

    return (
        <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values: Values, { setErrors }) => {
                if (token) {
                    try {
                        const response: AxiosResponse<any> = await authorizedAPI(token).post('/api/v1/jehlomat/user', values);
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
                    <Form onSubmit={handleSubmit}>
                        <FormItem>Vložte e-mailovou adresu a stiskněte tlačítko přidat.</FormItem>
                        <FormItem>
                            <FormItemLabel>Email uživatele</FormItemLabel>
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
                            <FormItemDescription>Na danou adresu bude zaslán registrační odkaz pro nového uživatele.</FormItemDescription>
                        </FormItem>
                        <PrimaryButton text="Přidat" type="submit" disabled={!isValid} />
                    </Form>
                );
            }}
        </Formik>
    );
};

export default PridatUzivatele;
