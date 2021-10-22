import { FC } from 'react';

import { Formik, Form, FormikHelpers } from 'formik';
import TextInput from '../Components/Inputs/TextInput/TextInput';
import SecondaryButton from '../Components/Buttons/SecondaryButton/SecondaryButton';
import { FormHeading, FormItemLabel } from '../Components/Utils/Typography';
import { FormItem, FormWrapper, Wrapper } from '../Components/Form/Form';
import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';

interface IRegistraceOrganizace { }

interface Values {
    email: string;
    heslo: string;
    jmeno: string;
}

const RegistraceOrganizace: FC<IRegistraceOrganizace> = ({ }) => {
    return (
        <>
            <FormHeading>Admin organizace</FormHeading>
            <Formik
                initialValues={{ email: '', heslo: '', jmeno: '' }}
                onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
                    console.log(values);

                }}
            >
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors }) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                type="text"
                                name="organizace"
                                placeholder="Název organizace *"
                                label="Organizace"
                                required={true}
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
                            />
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                type="password"
                                name="heslo"
                                placeholder="Heslo"
                                label="Heslo *"
                                required={true}
                            />
                            <TextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                type="password"
                                name="heslo-over"
                                placeholder="Heslo"
                                label="Potvrzeni hesla *"
                                required={true}
                            />
                            <PrimaryButton text="Zalozit" type="submit" />
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

export default RegistraceOrganizace;
