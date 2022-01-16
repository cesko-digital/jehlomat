import type { NextPage } from "next"
import { Formik, Form } from "formik"
import TextInput from "components/Inputs/TextInput/TextInput"
import { FormItemLabel, FormItemDescription } from "utils/typography"
import { FormItem } from "components/Form/Form"
import PrimaryButton from "components/Buttons/PrimaryButton/PrimaryButton"
import API from "config/baseURL"
import { AxiosResponse } from "axios"
import * as yup from "yup"
import { Header } from "components/Header/Header"
import { useRouter } from "next/router"

interface Values {
  email: string
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Vlož validní email")
    .required("Email je povinné pole"),
})

const UserNew: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <Header mobileTitle="Přidat uživatele" />

      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values: Values, { setErrors }) => {
          try {
            const response: AxiosResponse<any> = await API.post(
              "/api/v1/jehlomat/user/",
              values
            )
            const status = response.status

            switch (true) {
              case /2[0-9][0-9]/g.test(status.toString()): {
                router.push("/uzivatel/dekujeme")
                break
              }
              case status === 409: {
                //for validation error;
                setErrors({ email: response.data })
                break
              }
              default: {
                //all others goes to error page; TODO push to error page
                break
              }
            }
          } catch (error: any) {
            //link to error page
          }
        }}
      >
        {({
          handleSubmit,
          touched,
          handleChange,
          handleBlur,
          values,
          errors,
          isValid,
        }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <FormItem>
                Vložte e-mailovou adresu a stiskněte tlačítko přidat.
              </FormItem>
              <FormItem>
                <FormItemLabel>Email uživatele</FormItemLabel>
                <TextInput
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  type="text"
                  name="email"
                  placeholder="Email"
                  required={true}
                  error={
                    touched.email && Boolean(errors.email)
                      ? errors.email
                      : undefined
                  }
                />
                <FormItemDescription>
                  Na danou adresu bude zaslán registrační odkaz pro nového
                  uživatele.
                </FormItemDescription>
              </FormItem>
              <PrimaryButton text="Přidat" type="submit" disabled={!isValid} />
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default UserNew
