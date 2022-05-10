import React, { FunctionComponent } from 'react';
import { useMediaQuery } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { media } from 'utils/media';
import { PASSWORD_COMPLEXITY } from 'utils/constants';
import SignInImage from 'assets/images/sign-in.svg';
import { Header } from 'Components/Header/Header';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import TwoColumns from 'Components/Layout/TwoColumns';
import { Input, Inputs, FormTitle, TransparentForm, ButtonsContainer, Illustration } from './Components';
import useSetNewPassword, { SetPasswordFormProps } from "./hooks/useSetNewPassword";
import { texts } from "./SetNewPassword.texts";

const schema = yup.object({
    password: yup.string().matches(PASSWORD_COMPLEXITY, texts.VALIDATIONS__SYMBOLS).min(8, texts.VALIDATIONS__MIN_LENGTH).required(texts.VALIDATIONS__REQUIRED),
    rePassword: yup.string().oneOf([yup.ref('password')], texts.VALIDATIONS__MATCH),
});

const init: SetPasswordFormProps = {
    password: '',
    rePassword: '',
}

const ResetPassword: FunctionComponent = () => {
    const isDesktop = useMediaQuery(media.gt('mobile'));
    const { handleFormSubmit } = useSetNewPassword();

    return (
        <>
            <Header mobileTitle={texts.MOBILE_TITLE} />
            <TwoColumns
                left={
                    <Formik initialValues={init} validationSchema={schema} onSubmit={handleFormSubmit}>
                        {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => (
                            <TransparentForm onSubmit={handleSubmit}>
                                <FormTitle>{texts.TITLE}</FormTitle>
                                <Inputs>
                                    <Input
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        name="password"
                                        type="password"
                                        placeholder={texts.INPUT__PASS__PLACEHOLDER}
                                        label={texts.INPUT__PASS__LABEL}
                                        required={true}
                                        error={touched.password && errors.password ? errors.password : undefined}
                                    />
                                    <Input
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.rePassword}
                                        type="password"
                                        name="rePassword"
                                        placeholder={texts.INPUT__RE_PASS__PLACEHOLDER}
                                        label={texts.INPUT__RE_PASS__LABEL}
                                        required={true}
                                        error={touched.rePassword && errors.rePassword ? errors.rePassword : undefined}
                                    />
                                </Inputs>
                                <ButtonsContainer>
                                    <PrimaryButton text={texts.BUTTONS__SEND} type="submit" disabled={!isValid} />
                                </ButtonsContainer>
                            </TransparentForm>
                        )}
                    </Formik>
                }
                right={
                    isDesktop && (
                        <Illustration>
                            <img src={SignInImage} alt="Zapomenuté heslo" />
                        </Illustration>
                    )
                }
            />
        </>
    );
};

export default ResetPassword;
