import { FC } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import TextInput from '../Components/Inputs/TextInput/TextInput';
import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';
import * as yup from 'yup';
import {useHistory} from "react-router-dom";
import API from '../config/baseURL';
import { AxiosResponse } from 'axios';

interface IRegistraceOrganizace { }

interface Values {
    organizace: string;
    email: string;
    heslo: string;
    hesloConfirm: string;
}

const validationSchema = yup.object({
    organizace: yup.string().required('Název organizace je povinné pole'),
    email: yup.string().email('Vlož validní email').required('Email je povinné pole'),
    heslo: yup.string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Heslo je povinné pole'),
    hesloConfirm: yup.string().oneOf([yup.ref('heslo'), null], 'Hesla musí být stejná')
});

const RegistraceOrganizace: FC<IRegistraceOrganizace> = ({ }) => {
    let history = useHistory();
    return (
        <>
            <Formik
                initialValues={{ organizace: '', email: '', heslo: '', hesloConfirm: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values: Values, { setErrors}) => {
                    try {
                        const response:AxiosResponse<any> = await API.post("/api/v1/jehlomat/organization", values);
                        const status = response.status;
                        switch (true) {
                            case /2[0-9][0-9]/g.test(status.toString()): {
                                //for all success response; 
                                history.push("/organizace/dekujeme")
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
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid}) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.organizace}
                                type="text"
                                name="organizace"
                                placeholder="Název organizace *"
                                label="Organizace"
                                required={true}
                                error={touched.organizace && Boolean(errors.organizace) ? errors.organizace : undefined}
                            />
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                type="email"
                                name="email"
                                placeholder="E-mail organizace *"
                                label="E-mail"
                                required={true}
                                error={touched.email && Boolean(errors.email) ? errors.email : undefined}
                            />
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.heslo}
                                type="password"
                                name="heslo"
                                placeholder="Potvrzení hesla"
                                label="Heslo *"
                                required={true}
                                error={touched.heslo && Boolean(errors.heslo) ? errors.heslo : undefined}
                            />
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.hesloConfirm}
                                type="password"
                                name="hesloConfirm"
                                placeholder="Heslo"
                                label="Potvrzeni hesla *"
                                required={true}
                                error={touched.hesloConfirm && Boolean(errors.hesloConfirm) ? errors.hesloConfirm : undefined}
                            />
                            <PrimaryButton text="Zalozit" type="submit" disabled={!isValid}/>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

export default RegistraceOrganizace;
