import React, { FC } from "react";
import {
  Text,
  Label,
  Input,
  Wrapper,
  Button,
  FormItem,
  FormWrapper,
} from "./styles";
import { Formik, Field, Form, FormikHelpers } from "formik";

interface IRegistrace {}

interface Values {
  email: string;
  password: string;
  oblast: string;
}

const Registrace: FC<IRegistrace> = ({}) => {
  return (
    <Wrapper>
      <Formik
        initialValues={{ email: "", password: "", oblast: "" }}
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
                  <Label>
                    Email *
                    {touched.email && errors.email && (
                      <Text color="red">{errors.email}</Text>
                    )}
                    <Input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      type="text"
                      name="email"
                      placeholder="Email"
                    />
                  </Label>
                </FormItem>

                <FormItem>
                  <Label>
                    Password *
                    {touched.password && errors.password && (
                      <Text color="red">{errors.password}</Text>
                    )}
                    <Input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      type="password"
                      name="password"
                      placeholder="Password"
                    />
                  </Label>
                </FormItem>
                <FormItem>
                  <label htmlFor="oblast">Oblast</label>
                  <Field as="select" name="oblast" id="oblast">
                    <option value="">Vyber</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                  </Field>
                </FormItem>
                <Button type="submit">Zalozit</Button>
              </FormWrapper>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default Registrace;
