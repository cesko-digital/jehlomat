import React, {FunctionComponent} from "react";
import {useHistory} from "react-router-dom";
import {useMediaQuery} from "@mui/material";
import {Formik, FormikHelpers} from "formik";
import {AxiosResponse} from "axios";
import * as yup from "yup";
import API from "config/baseURL";
import {media} from "utils/media";
import hasOwnProperty from "utils/hasOwnProperty";
import SignInImage from "assets/images/sign-in.svg";
import {Header} from "Components/Header/Header";
import PrimaryButton from "Components/Buttons/PrimaryButton/PrimaryButton";
import TwoColumns from "Components/Layout/TwoColumns";
import {Input,Inputs,FormTitle,TransparentForm,ButtonsContainer,Illustration} from "./Components";

const texts = {
  TITLE: "Nové heslo",
  MOBILE_TITLE: "Nové heslo",
  INPUT__PASS__LABEL: "Nové heslo",
  INPUT__PASS__PLACEHOLDER: "Snadno zapomatovatelné, těžce uhodnutelné",
  INPUT__RE_PASS__LABEL: "Kontrola hesla",
  INPUT__RE_PASS__PLACEHOLDER: "Zadejte stejné heslo",
  VALIDATIONS__REQUIRED: "Povinná položka",
  VALIDATIONS__SYMBOLS: "Heslo musí obsahovat číslo, velké a malé písmeno",
  VALIDATIONS__MIN_LENGTH: "Heslo musí být 8 znaků dlouhé",
  VALIDATIONS__MATCH: "Hesla musí být stejná",
  BUTTONS__SEND: "Nastav heslo",
};

interface ResetPasswordFormProps {
  password: string;
  rePassword: string;
}

const init: ResetPasswordFormProps = {
  password: '',
  rePassword: '',
}

const schema = yup.object({
  password: yup.string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, texts.VALIDATIONS__SYMBOLS)
    .min(8, texts.VALIDATIONS__MIN_LENGTH)
    .required(texts.VALIDATIONS__REQUIRED),
  rePassword: yup.string().oneOf([yup.ref('password')], texts.VALIDATIONS__MATCH),
});

const ResetPassword: FunctionComponent = () => {
  const isDesktop = useMediaQuery(media.gt('mobile'));
  const history = useHistory();
  
  const handleSubmit = async (values: ResetPasswordFormProps, { setErrors }: FormikHelpers<ResetPasswordFormProps>) => {
    try {
      const response: AxiosResponse = await API.post('/api/v1/jehlomat/change-password', values);

      const status = response.status;
      const isSuccess = status >= 200 && status < 300;
      
      if (isSuccess) {
        history.push('/');
        return;
      }

      if (response.data && 
        typeof response.data === "object" && 
        hasOwnProperty(response.data, "fieldName") && 
        hasOwnProperty(response.data, "status")
      ) {
        const fieldName = response.data.fieldName as string;
        setErrors({ 
          [fieldName]: response.data.status,
        });
        
        return;
      }

      history.push('/');
    } catch (error: unknown) {
      console.warn("Unable to set a new password", error);
      
      history.push('/error');
    }
  };
  
  return (
    <>
      <Header mobileTitle={texts.MOBILE_TITLE} />
      <TwoColumns
        left={(
          <Formik
            initialValues={init}
            validationSchema={schema}
            onSubmit={handleSubmit}>
            {({
                handleSubmit,
                touched,
                handleChange,
                handleBlur,
                values,
                errors,
                isValid
              }
            ) => (
              <TransparentForm onSubmit={handleSubmit}>
                <FormTitle>{texts.TITLE}</FormTitle>
                <Inputs>
                  <Input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    type="password"
                    name="password"
                    placeholder={texts.INPUT__PASS__PLACEHOLDER}
                    label={texts.INPUT__PASS__LABEL}
                    required={true}
                    error={(touched.password && errors.password) ? errors.password : undefined}
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
                    error={(touched.rePassword && errors.rePassword) ? errors.rePassword : undefined}
                  />
                </Inputs>
                <ButtonsContainer>
                  <PrimaryButton text={texts.BUTTONS__SEND} type="submit" disabled={!isValid} />
                </ButtonsContainer>
              </TransparentForm>
            )}
          </Formik>
        )}
        right={isDesktop && (
          <Illustration>
            <img src={SignInImage} alt="Zapomenuté heslo" />
          </Illustration>
        )}
      />
    </>
  );
}

export default ResetPassword;
