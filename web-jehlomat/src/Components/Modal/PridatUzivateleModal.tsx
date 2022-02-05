import { FC } from 'react';
import { Formik, Form } from 'formik';
import { useMediaQuery } from '@mui/material';
import TextInput from '../../Components/Inputs/TextInput/TextInput';
import { FormItemLabel, FormItemDescription } from '../../utils/typography';
import { FormItem } from '../../Components/Form/Form';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import { useHistory } from 'react-router-dom';
import API from '../../config/baseURL';
import { AxiosResponse } from 'axios';
import * as yup from 'yup';
import styled from '@emotion/styled';
import { primaryDark} from '../../utils/colors';
import { media } from '../../utils/media';

interface Props {}

interface Values {
    email: string;
}

const validationSchema = yup.object({
    email: yup.string().email('Vlož validní email').required('Email je povinné pole'),
});

const ModalUserForm = styled.div`
    color: ${primaryDark};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ModalUserFormContent = styled.div<{ mobile?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    // width: 340px;
    ${props =>
        props.mobile &&
        `
        font-weight: 500;
        line-height: 24px;
        text-align: left;
    `}
`;

export const ModalFormItem = styled(FormItem)<{ mobile?: boolean }>`
    font-family: Roboto;
    margin: 10px;
    ${props =>
        props.mobile &&
        `
    `}
`;

const ModalFormItemLabel = styled(FormItemLabel)`
    text-transform: none;
`;

const ModalFormItemDescription = styled(FormItemDescription)<{ mobile?: boolean }>`
    color: ${primaryDark};
    ${props =>
        props.mobile &&
        `
        font-size: 18px;
        width: 90%;
    `}
`;


const PridatUzivateleModal: FC<Props> = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    let history = useHistory();
    return (
        <>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values: Values, { setErrors }) => {
                    try {
                        const response: AxiosResponse<any> = await API.post('/api/v1/jehlomat/user/', values);
                        const status = response.status;

                        switch (true) {
                            case /2[0-9][0-9]/g.test(status.toString()): {
                                history.push('/uzivatel/dekujeme');
                                break;
                            }
                            case status === 409: {
                                //for validation error;
                                setErrors({ email: response.data });
                                break;
                            }
                            default: {
                                //all others goes to error page; TODO push to error page
                                break;
                            }
                        }
                    } catch (error: any) {
                        //link to error page
                    }
                }}
            >
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                    return (
                        <ModalUserForm>
                            <Form onSubmit={handleSubmit}>
                                <ModalUserFormContent mobile={isMobile}>
                                    <ModalFormItemDescription mobile={isMobile}>Vložte e-mailovou adresu a stiskněte tlačítko přidat.</ModalFormItemDescription>
                                    <ModalFormItem>
                                        <ModalFormItemLabel>Email uživatele</ModalFormItemLabel>
                                        <TextInput
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            type="text"
                                            name="email"
                                            placeholder="Email"
                                            required={true}
                                            error={touched.email && Boolean(errors.email) ? errors.email : undefined}
                                            width={isMobile ? "270px" : "320px"}
                                        />
                                    </ModalFormItem>
                                    <ModalFormItemDescription mobile={isMobile}>Na danou adresu bude zaslán registrační odkaz pro nového uživatele.</ModalFormItemDescription>
                                    <PrimaryButton text="Přidat" type="submit" disabled={!isValid} />
                                </ModalUserFormContent>
                            </Form>
                        </ModalUserForm>
                    );
                }}
            </Formik>
        </>
    );
};

export default PridatUzivateleModal;
