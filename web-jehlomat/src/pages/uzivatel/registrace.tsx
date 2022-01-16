import type { NextPage } from "next"
import { Formik, Form, FormikHelpers, isString } from "formik"
import TextInput from "components/Inputs/TextInput/TextInput"
import { FormHeading } from "utils/typography"
import PrimaryButton from "components/Buttons/PrimaryButton/PrimaryButton"
import * as yup from "yup"
import React from "react"
import { Header } from "components/Header/Header"
import { useRouter } from "next/router"
import { LINKS } from "utils/links"
import { useUserVerification } from "api/mutations/useUserVerification"

interface IValues {
  email: string
  heslo: string
  jmeno: string
  hesloConfirm: string
}

const validationSchema = yup.object({
  jmeno: yup.string().required("Jméno je povinné pole"),
  email: yup
    .string()
    .email("Vlož validní email")
    .required("Email je povinné pole"),
  heslo: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
      "Heslo musí obsahovat číslo, velké a malé písmeno"
    )
    .min(8, "Heslo musí být 8 znaků dlouhé")
    .required("Heslo je povinné pole"),
  hesloConfirm: yup
    .string()
    .oneOf([yup.ref("heslo"), null], "Hesla musí být stejná"),
})

const UserRegistration: NextPage = () => {
  const router = useRouter()

  const email = isString(router.query.email) ? router.query.email : ""
  const code = isString(router.query.code) ? router.query.code : ""

  const { mutateAsync } = useUserVerification()

  return (
    <>
      <Header mobileTitle="Nový uživatel" />

      <FormHeading>Pracovnik Organizace</FormHeading>
      <Formik
        initialValues={{ email, heslo: "", hesloConfirm: "", jmeno: "" }}
        validationSchema={validationSchema}
        onSubmit={async (
          values: IValues,
          { setErrors }: FormikHelpers<IValues>
        ) => {
          try {
            const response = await mutateAsync({
              email,
              password: values.heslo,
              username: values.jmeno,
              code,
            })

            const status = response.status

            switch (true) {
              case /2[0-9][0-9]/g.test(status.toString()): {
                //for all success response;
                router.push(LINKS.userThankYou)
                break
              }
              case status === 409: {
                //for validation error;
                const fieldName = response.data.fieldName
                setErrors({ [fieldName]: response.data.status })
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
              <TextInput
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                disabled={true}
                type="text"
                name="email"
                placeholder="Email"
                label="E-mail pracovníka*"
                required={true}
                error={
                  touched.email && Boolean(errors.email)
                    ? errors.email
                    : undefined
                }
              />
              <TextInput
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.jmeno}
                type="text"
                name="jmeno"
                placeholder="jméno"
                label="Uživatelské jméno*"
                required={true}
                error={
                  touched.jmeno && Boolean(errors.jmeno)
                    ? errors.jmeno
                    : undefined
                }
              />
              <TextInput
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.heslo}
                type="password"
                name="heslo"
                placeholder="heslo"
                label="Heslo*"
                required={true}
                error={
                  touched.heslo && Boolean(errors.heslo)
                    ? errors.heslo
                    : undefined
                }
              />
              <TextInput
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.hesloConfirm}
                type="password"
                name="hesloConfirm"
                placeholder="heslo"
                label="Potvrzení hesla*"
                required={true}
                error={
                  touched.hesloConfirm && Boolean(errors.hesloConfirm)
                    ? errors.hesloConfirm
                    : undefined
                }
              />
              <PrimaryButton
                id="submit"
                text="DOKONČIT"
                type="submit"
                disabled={!isValid}
              />
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default UserRegistration
