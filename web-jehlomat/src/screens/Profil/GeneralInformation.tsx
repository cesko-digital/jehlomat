import { SContainer, STextInput } from '../RegistraceOrganizace/components/RegistrationForm.styled';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import { FC } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { API } from 'config/baseURL';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';
import { LINKS } from 'routes';
import apiURL from 'utils/api-url';
import { media } from 'utils/media';
import { userState } from 'store/user';
import { isStatusGeneralSuccess } from 'utils/payload-status';
import { userIDState } from 'store/login';
import { IOrganizace, ITeam, IUser } from 'types';
import ChipList from '../Team/ChipList';
import Item from 'screens/Team/Item';

const validationSchema = yup.object({
    email: yup.string().email('Email nemá správný formát.').required('Email je povinné pole'),
    username: yup.string().required('Uživatelské jméno je povinné pole'),
});

interface IValues {
    email: string;
    username: string;
    organizationId: number;
    teamId: number | undefined;
}

interface EditedUser {
    email: string;
    username: string;
    teamId: number | null;
}

interface IProps {
    user: IUser;
    organization: IOrganizace | undefined;
    setSuccessOpen: (successOpen: boolean) => void;
    teams: ITeam[];
}

const GeneralInformation: FC<IProps> = ({ user, organization, setSuccessOpen, teams }) => {
    const history = useHistory();
    const isMobile = useMediaQuery(media.lte('mobile'));
    const userId = useRecoilValue(userIDState);
    const loggedUser = useRecoilValue(userState);

    const onSubmit = async (values: IValues, { setErrors }: FormikHelpers<IValues>) => {
        try {
            const editedUser: EditedUser = {
                email: values.email,
                username: values.username,
                teamId: values.teamId ?? null,
            };

            if (!userId) throw new Error();
            const response: AxiosResponse<any> = await API.put(apiURL.putUser(userId), editedUser);
            if (isStatusGeneralSuccess(response.status)) {
                history.push(LINKS.PROFILE);
                setSuccessOpen(true);
            } else {
                throw new Error();
            }
        } catch (error: any) {
            history.push(LINKS.ERROR);
        }
    };

    return (
        <SContainer>
            <Typography mb={4} variant="h6" textAlign="center">
                Obecné informace
            </Typography>
            <Formik
                initialValues={{
                    email: loggedUser?.email ?? '',
                    username: user.username,
                    organizationId: user.organizationId,
                    teamId: user.teamId,
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box display="flex" flexDirection="column" gap={2} mb={5}>
                            <STextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                type="text"
                                name="email"
                                placeholder="Email"
                                label="E-mail"
                                required
                                error={Boolean(errors.email) ? errors.email : undefined}
                            />
                            <STextInput
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.username}
                                type="text"
                                name="username"
                                placeholder="Uživatelské jméno"
                                label="Uživatelské jméno"
                                required
                                error={Boolean(errors.username) ? errors.username : undefined}
                            />
                            <STextInput value={organization?.name || ''} type="text" name="organization" placeholder="Organizace" label="Organizace" disabled />
                            <ChipList label="Týmy">{teams.length > 0 ? teams.map(team => <Item name={team.name} id={team.id.toString()} />) : <Typography>{'- Žádný tým'}</Typography>}</ChipList>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            {isMobile ? <PrimaryButton id="submit" text="Uložit" type="submit" disabled={!isValid} /> : <SecondaryButton id="submit" text="Uložit" type="submit" disabled={!isValid} />}
                        </Box>
                    </Form>
                )}
            </Formik>
        </SContainer>
    );
};

export default GeneralInformation;
