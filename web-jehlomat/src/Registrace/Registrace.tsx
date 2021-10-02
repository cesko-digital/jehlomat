import { FC } from "react";

import { Formik, Form, FormikHelpers } from "formik";
import TextInput from "../Components/Inputs/TextInput/TextInput";
import SecondaryButton from "../Components/Buttons/SecondaryButton/SecondaryButton";
import { FormItemLabel, H4 } from "../Components/Utils/Typography";
import { FormItem, FormWrapper, Wrapper } from "../Components/Form/Form";

interface IRegistrace {}

interface Values {
  email: string;
  heslo: string;
  jmeno: string;
}

const Registrace: FC<IRegistrace> = ({}) => {
  return (
    <Wrapper>
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
            <Form onSubmit={handleSubmit}>
              <FormWrapper>
                <FormItem>
                  <FormItemLabel>Email organizace</FormItemLabel>
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
                <SecondaryButton text="Zalozit" type="submit" />
              </FormWrapper>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default Registrace;
