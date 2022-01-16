import type { NextPage } from "next"
import { Formik, Form } from "formik"
import TextInput from "components/Inputs/TextInput/TextInput"
import PrimaryButton from "components/Buttons/PrimaryButton/PrimaryButton"
import * as yup from "yup"
import { useRouter } from "next/router"
import { LINKS } from "utils/links"
import { useCreateOrganization } from "api/mutations/useCreateOrganization"

interface IValues {
  organizace: string
  email: string
  heslo: string
  hesloConfirm: string
}

const validationSchema = yup.object({
  organizace: yup.string().required("Název organizace je povinné pole"),
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

const OrganizationRegistration: NextPage = () => {
  const router = useRouter()

  const { mutateAsync } = useCreateOrganization()

  return (
    <>
      <Formik
        initialValues={{
          organizace: "",
          email: "",
          heslo: "",
          hesloConfirm: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values: IValues, { setErrors }) => {
          try {
            const response = await mutateAsync({
              name: values.organizace,
              email: values.email,
              password: values.heslo,
            })

            const status = response.status

            switch (true) {
              case /2[0-9][0-9]/g.test(status.toString()): {
                //for all success response;
                router.push(LINKS.organizationThankYou)
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
                id="organizace"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.organizace}
                type="text"
                name="organizace"
                placeholder="Název organizace *"
                label="Organizace"
                required={true}
                error={
                  touched.organizace && Boolean(errors.organizace)
                    ? errors.organizace
                    : undefined
                }
              />
              <TextInput
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                type="email"
                name="email"
                placeholder="E-mail organizace *"
                label="E-mail"
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
                value={values.heslo}
                type="password"
                name="heslo"
                placeholder="Heslo"
                label="Heslo *"
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
                placeholder="Heslo"
                label="Potvrzeni hesla *"
                required={true}
                error={
                  touched.hesloConfirm && Boolean(errors.hesloConfirm)
                    ? errors.hesloConfirm
                    : undefined
                }
              />
              <PrimaryButton
                id="submit"
                text="Založit"
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

export default OrganizationRegistration
