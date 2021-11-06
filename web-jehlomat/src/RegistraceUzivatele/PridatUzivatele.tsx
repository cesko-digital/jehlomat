import { FC } from 'react';

import { Formik, FormikHelpers } from 'formik';
import TextInput from '../Components/Inputs/TextInput/TextInput';
import { FormHeading, FormItemLabel, FormItemDescription } from '../Components/Utils/Typography';
import { FormItem, FormWrapper, Wrapper } from '../Components/Form/Form';
import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';
import TitleBar from '../Components/Navigation/TitleBar';

interface IPridatUzivatele {}

interface Values {
    email: string;
}

const PridatUzivatele: FC<IPridatUzivatele> = ({}) => {
    return (
        <>
            <TitleBar>Přidat uživatele</TitleBar>
            <Wrapper>
                <Formik
                    initialValues={{ email: ''}}
                    onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(values)
                        };
                        fetch('http://localhost:8082/api/v1/jehlomat/users/', requestOptions)
                            .then(async response => {
                                if (!response.ok) {
                                // get error message from body or default to response status
                                const error = response.status;
                                return Promise.reject(error);
                            }
                                console.log(response);
                            })
                            .catch(error => {
                                console.error('There was an error!', error);
                            })
                    }}
                >
                    {({ handleSubmit, touched, handleChange, handleBlur, values, errors }) => {
                        return (
                            <FormWrapper onSubmit={handleSubmit}>
                                <FormItem>Vložte e-mailovou adresu a stiskněte tlačítko přidat.</FormItem>
                                <FormItem>
                                    <FormItemLabel>Email uživatele</FormItemLabel>
                                    <TextInput onChange={handleChange} onBlur={handleBlur} value={values.email} type="text" name="email" placeholder="Email" />
                                    <FormItemDescription>Na danou adresu bude zaslán registrační odkaz pro nového uživatele.</FormItemDescription>
                                </FormItem>
                                <PrimaryButton text="Přidat" type="submit" />
                            </FormWrapper>
                        );
                    }}
                </Formik>
            </Wrapper>
        </>
    );
};

export default PridatUzivatele;
