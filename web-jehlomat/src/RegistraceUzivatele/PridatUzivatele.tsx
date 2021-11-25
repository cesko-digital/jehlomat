import { FC } from 'react';

import { Formik, FormikHelpers } from 'formik';
import TextInput from '../Components/Inputs/TextInput/TextInput';
import { FormHeading, FormItemLabel, FormItemDescription } from '../Components/Utils/Typography';
import { FormItem, FormWrapper, Wrapper } from '../Components/Form/Form';
import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';
import TitleBar from '../Components/Navigation/TitleBar';
import {useHistory} from "react-router-dom";
import API from '../config/baseURL';
import { AxiosResponse } from 'axios';
import * as yup from 'yup';

interface IPridatUzivatele {}

interface Values {
    email: string;
}

const validationSchema = yup.object({
    email: yup.string().email('Vlož validní email').required('Email je povinné pole')
});

const PridatUzivatele: FC<IPridatUzivatele> = ({}) => {
    let history = useHistory();
    return (
        <>
            <TitleBar>Přidat uživatele</TitleBar>
            <Wrapper>
                <Formik
                    initialValues={{ email: ''}}
                    validationSchema={validationSchema}
                    onSubmit={async (values: Values, { setErrors}) => {
                        try {
                            const response:AxiosResponse<any> = await API.post("/api/v1/jehlomat/users", values);
                            const status = response.status;

                            switch (true) {
                                case /2[0-9][0-9]/g.test(status.toString()): {
                                    //for all success response;
                                    //TODO: route to Ověření emailu component
                                    //history.push("/organizace/dekujeme")
                                    break;
                                }
                                case status === 409: {
                                    //for validation error;
                                    const fieldName = response.data.fieldName
                                    setErrors({[fieldName]: response.data.status})
                                    break;
                                }
                                default: {
                                    //all others goes to error page; TODO push to error page
                                    break;
                                }
                            }
                        } catch(error: any) {
                            //link to error page
                        }
                    }}
                >
                    {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                        return (
                            <FormWrapper onSubmit={handleSubmit}>
                                <FormItem>Vložte e-mailovou adresu a stiskněte tlačítko přidat.</FormItem>
                                <FormItem>
                                    <FormItemLabel>Email uživatele</FormItemLabel>
                                    <TextInput
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        type="text" name="email"
                                        placeholder="Email"
                                        required={true}
                                        error={touched.email && Boolean(errors.email) ? errors.email : undefined} />
                                    <FormItemDescription>Na danou adresu bude zaslán registrační odkaz pro nového uživatele.</FormItemDescription>
                                </FormItem>
                                <PrimaryButton text="Přidat" type="submit" disabled={!isValid} />
                            </FormWrapper>
                        );
                    }}
                </Formik>
            </Wrapper>
        </>
    );
};

export default PridatUzivatele;
