import { FC } from 'react';

import { Formik, Form, FormikHelpers } from 'formik';
import TextInput from '../Components/Inputs/TextInput/TextInput';
import SecondaryButton from '../Components/Buttons/SecondaryButton/SecondaryButton';
import { FormHeading, FormItemLabel } from '../Components/Utils/Typography';
import { FormItem, FormWrapper, Wrapper } from '../Components/Form/Form';
import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';

interface IRegistraceOrganizace {}

interface Values {
    email: string;
    heslo: string;
    jmeno: string;
}

const RegistraceOrganizace: FC<IRegistraceOrganizace> = ({}) => {
    return (
        <Wrapper>
            <FormHeading>Admin organizace</FormHeading>
            <Formik
                initialValues={{ email: '', heslo: '', jmeno: '' }}
                onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
                    console.log(values);
                }}
            >
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors }) => {
                    return (
                        <FormWrapper onSubmit={handleSubmit}>
                            <FormItem>
                                <FormItemLabel>Email organizace</FormItemLabel>
                                <TextInput onChange={handleChange} onBlur={handleBlur} value={values.email} type="text" name="email" placeholder="Email" />
                            </FormItem>

                            <FormItem>
                                <FormItemLabel>Uzivatelske jmeno *</FormItemLabel>
                                <TextInput autoComplete="username" onChange={handleChange} onBlur={handleBlur} value={values.jmeno} type="text" name="jmeno" placeholder="Jmeno" />
                            </FormItem>

                            <FormItem>
                                <FormItemLabel>Heslo *</FormItemLabel>
                                <TextInput autoComplete="new-password" onChange={handleChange} onBlur={handleBlur} value={values.heslo} type="heslo" name="heslo" placeholder="Heslo" />
                            </FormItem>
                            <FormItem>
                                <FormItemLabel>Potvrzeni hesla *</FormItemLabel>
                                <TextInput autoComplete="new-password" type="heslo" name="heslo" placeholder="Heslo" />
                            </FormItem>
                            <PrimaryButton text="Zalozit" type="submit" />
                        </FormWrapper>
                    );
                }}
            </Formik>
        </Wrapper>
    );
};

export default RegistraceOrganizace;
