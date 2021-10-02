import React from "react";
import { FormWrapper, Wrapper } from "./styles";
import { Formik, Field, Form } from "formik";

const Register: React.FC<{}> = () => {
  console.log("Test");
  return (
    <Wrapper>
      <h1>Jehhlomat registrace oraganizace</h1>

      <Formik
        initialValues={{
          orgName: "",
          orgEmail: "",
        }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <Form>
          <FormWrapper>
            <label htmlFor="orgName">Nazev organizace</label>
            <Field id="orgName" name="orgName" placeholder="Jane" />

            <label htmlFor="orgEmail">Email Organizace</label>
            <Field
              id="orgEmail"
              name="orgEmail"
              placeholder="jane@acme.com"
              type="email"
            />
            <button type="submit">Registrovat se</button>
          </FormWrapper>
        </Form>
      </Formik>
    </Wrapper>
  );
};

export default Register;
