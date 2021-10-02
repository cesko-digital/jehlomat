import { FC } from "react";

import { Formik, Form, FormikHelpers } from "formik";
import TextInput from "../Components/Inputs/TextInput/TextInput";
import SecondaryButton from "../Components/Buttons/SecondaryButton/SecondaryButton";
import {
  FormHeading,
  FormItemLabel,
  H1,
  H4,
} from "../Components/Utils/Typography";
import { FormItem, FormWrapper, Wrapper } from "../Components/Form/Form";
import PrimaryButton from "../Components/Buttons/PrimaryButton/PrimaryButton";

interface IRegistrace {}

interface Values {
  email: string;
  heslo: string;
  jmeno: string;
}

const RegistraceUzivatel: FC<IRegistrace> = ({}) => {
  return (
    <Wrapper>
      <FormHeading>Pracovnik Organizace </FormHeading>
      <Formik
        initialValues={{ email: "", heslo: "", jmeno: "" }}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          console.log(values);
        }}
      >
        {({
          handleSubmit,
          touched,
          handleChange,
          handleBlur,
          values,
          errors,
        }) => {
          return (
            <FormWrapper onSubmit={handleSubmit}>
              <H1>Pracovnik organizace</H1>

              <FormItem>
                <FormItemLabel>Email Pracovnika</FormItemLabel>
                <TextInput
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  type="text"
                  name="email"
                  placeholder="Email"
                />
              </FormItem>

              <FormItem>
                <FormItemLabel>Uzivatelske jmeno *</FormItemLabel>
                <TextInput
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.jmeno}
                  type="text"
                  name="jmeno"
                  placeholder="Jmeno"
                />
              </FormItem>

              <FormItem>
                <FormItemLabel>Heslo *</FormItemLabel>
                <TextInput
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.heslo}
                  type="heslo"
                  name="heslo"
                  placeholder="heslo"
                />
              </FormItem>
              <FormItem>
                <FormItemLabel>Potvrzeni hesla *</FormItemLabel>
                <TextInput type="heslo" name="heslo" placeholder="Password" />
              </FormItem>
              <PrimaryButton text="Zalozit" type="submit" />
            </FormWrapper>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default RegistraceUzivatel;
