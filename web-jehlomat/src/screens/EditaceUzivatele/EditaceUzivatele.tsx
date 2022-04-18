import { Grid, Container } from '@mui/material';
import { Header } from 'Components/Header/Header';
import imageSrc from 'assets/images/empty-state.svg';
import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { FormWrapper, ButtonWrapper, PageHeading } from './styled';
import { useCallback, useEffect, useState } from 'react';
import { tokenState } from 'store/login';
import { useRecoilValue } from 'recoil';
import { API } from 'config/baseURL';
import { AxiosResponse } from 'axios';
import { IOrganizace, ITeam, IUser } from 'types';
import { useHistory, useParams } from 'react-router-dom';
import { LINKS } from 'routes';
import apiURL from 'utils/api-url';
import { useMediaQuery } from '@mui/material';
import { media } from 'utils/media';
import { userState } from 'store/user';
import { AccessDenied } from 'screens/Organizace/403';
import { isStatusGeneralSuccess } from 'utils/payload-status';
import { primaryDark } from 'utils/colors';
import TextInput from 'Components/Inputs/TextInput';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import SelectInput from 'Components/Inputs/SelectInput/SelectInput';

const validationSchema = yup.object({
    email: yup.string().email('Email nemá správný formát.').required('Email je povinné pole'),
    username: yup.string().required('Uživatelské jméno je povinné pole'),
    teamId: yup.number().required('Tým je povinné pole'),
});

interface IParams {
    userId: string;
}

interface IValues {
    email: string;
    username: string;
    organizationId: number;
    teamId: number;
}

interface EditedUser {
    email: string;
    username: string;
    teamId: number;
}

const EditaceUzivatele: React.FC = () => {
    const token = useRecoilValue(tokenState);
    const history = useHistory();
    const isDesktop = useMediaQuery(media.gt('mobile'));
    const { userId } = useParams<IParams>();
    const loggedUser = useRecoilValue(userState);
    const [user, setUser] = useState<IUser>();
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [organization, setOrganization] = useState<IOrganizace>();

    useEffect(() => {
        if (token && userId) {
            const loadData = async (token: string) => {
                try {
                    const userResponse: AxiosResponse<IUser> = await API.get(apiURL.getUser(userId));
                    setUser(userResponse.data);
                    if (userResponse.data.organizationId) {
                        const teamsInOrganization: AxiosResponse<ITeam[]> = await API.get(apiURL.getTeamsInOrganization(userResponse.data.organizationId));
                        setTeams(teamsInOrganization.data);
                        const organizationInfo: AxiosResponse<IOrganizace> = await API.get(apiURL.getOrganization(userResponse.data.organizationId));
                        setOrganization(organizationInfo.data);
                    }
                } catch (err) {
                    history.push(LINKS.ERROR);
                }
            };
            loadData(token);
        }
    }, [history, token, userId]);

    const onSubmit = useCallback(
        async (values: IValues, { setErrors }: FormikHelpers<IValues>) => {
            try {
                const editedUser: EditedUser = {
                    email: values.email,
                    username: values.username,
                    teamId: values.teamId,
                };
                const response: AxiosResponse<any> = await API.put(apiURL.putUser(userId), editedUser);
                if (isStatusGeneralSuccess(response.status)) {
                    history.push(LINKS.USER);
                } else {
                    throw new Error();
                }
            } catch (error: any) {
                history.push(LINKS.ERROR);
            }
        },
        [history, userId],
    );

    if (!loggedUser?.isAdmin) {
        return <AccessDenied />;
    }

    return (
        <>
            <Header mobileTitle="Editace uživatele" />
            <Container
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                <Grid xs={isDesktop ? 7 : 12} item alignItems="start" container direction="column">
                    {isDesktop && (
                        <PageHeading align="left" variant="h1" color={primaryDark} sx={{ mt: '80px', mb: '86px', ml: '97px' }}>
                            Editace uživatele
                        </PageHeading>
                    )}
                    {user && (
                        <FormWrapper className={isDesktop ? '' : 'mobile'}>
                            <Formik
                                initialValues={{
                                    email: user.email,
                                    username: user.username,
                                    organizationId: user.organizationId,
                                    teamId: user.teamId,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                                    return (
                                        <Form onSubmit={handleSubmit}>
                                            <TextInput
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.email}
                                                type="text"
                                                name="email"
                                                placeholder="Email"
                                                label="E-mail"
                                                required
                                                error={touched.email && Boolean(errors.email) ? errors.email : undefined}
                                            />
                                            <TextInput
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.username}
                                                type="text"
                                                name="username"
                                                placeholder="Uživatelské jméno"
                                                label="Uživatelské jméno"
                                                required
                                                error={touched.username && Boolean(errors.username) ? errors.username : undefined}
                                            />
                                            <TextInput value={organization?.name || ''} type="text" name="organization" placeholder="Organizace" label="Organizace" disabled />
                                            <SelectInput
                                                values={teams}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.teamId}
                                                name="teamId"
                                                label="Tým"
                                                required
                                                error={touched.teamId && Boolean(errors.teamId) ? errors.teamId : undefined}
                                            />
                                            <ButtonWrapper>
                                                <PrimaryButton id="submit" text="ULOŽIT" type="submit" disabled={!isValid} />
                                            </ButtonWrapper>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </FormWrapper>
                    )}
                </Grid>
                {isDesktop && (
                    <Grid xs={5} item alignItems="center" container>
                        <img src={imageSrc} width="100%" alt="profile" />
                    </Grid>
                )}
            </Container>
        </>
    );
};

export default EditaceUzivatele;
