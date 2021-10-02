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
import { Formik, Field, Form } from "formik";

interface IRegistrace {}

const Registrace: FC<IRegistrace> = ({}) => {
  return (
    <Wrapper>
      {/* <Formik
        initialValues={{
          orgName: "",
          orgEmail: "",
          oblast: "",
        }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <Form>
          <FormWrapper>
            <FormItem>
              <label htmlFor="orgName">Nazev organizace</label>
              <Field id="orgName" name="orgName" placeholder="Jane" />
            </FormItem>

            <FormItem>
              <label htmlFor="orgEmail">Email Organizace</label>
              <Field
                id="orgEmail"
                name="orgEmail"
                placeholder="jane@acme.com"
                type="email"
              />
            </FormItem>

            <FormItem>
              <label htmlFor="oblast">Oblast</label>
              <Field as="select" name="oblast" id="oblast">
                <option value="">Vyber</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
              </Field>
              <button type="submit">Zalozit</button>
            </FormItem>
          </FormWrapper>
        </Form>
      </Formik> */}

      <Formik
        initialValues={{ email: "", password: "", oblast: "" }}
        onSubmit={(values) => {
          console.log(values);
        }}
        render={({
          touched,
          errors,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
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
        )}
      />
    </Wrapper>
  );
};

export default Registrace;
