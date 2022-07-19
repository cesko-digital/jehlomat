import { Grid, Container, Box } from '@mui/material';
import { Header } from 'Components/Header/Header';
import imageSrc from 'assets/images/empty-state.svg';
import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { ButtonWrapper, PageHeading, SectionWrapper } from './styled';
import { useEffect, useState } from 'react';
import { tokenState } from 'store/login';
import { useRecoilValue } from 'recoil';
import { API } from 'config/baseURL';
import { AxiosResponse } from 'axios';
import { IOrganizace, ITeam, IUser } from 'types';
import { useHistory } from 'react-router-dom';
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
import Loading from 'screens/Nalezy/Components/Loading';
import { userIDState } from 'store/login';
import { PASSWORD_COMPLEXITY } from '../../utils/constants';
import Modal from 'Components/Modal/Modal';

const validationSchema = yup.object({
    email: yup.string().email('Email nemá správný formát.').required('Email je povinné pole'),
    username: yup.string().required('Uživatelské jméno je povinné pole'),
    password: yup.string().matches(PASSWORD_COMPLEXITY, 'Heslo musí obsahovat číslo, velké a malé písmeno').min(8, 'Heslo musí být 8 znaků dlouhé'),
});

interface IValues {
    email: string;
    username: string;
    organizationId: number;
    teamId: number | undefined;
    password: string;
}

interface EditedUser {
    email: string;
    username: string;
    password?: string;
}

const Profile: React.FC = () => {
    const token = useRecoilValue(tokenState);
    const history = useHistory();
    const isDesktop = useMediaQuery(media.gt('mobile'));
    const userId = useRecoilValue(userIDState);
    const loggedUser = useRecoilValue(userState);

    const [user, setUser] = useState<IUser>();
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [organization, setOrganization] = useState<IOrganizace>();
    const [successOpen, setSuccessOpen] = useState(false);

    useEffect(() => {
        if (token && userId) {
            const loadData = async (token: string) => {
                try {
                    if (!userId) throw new Error();
                    const userResponse: AxiosResponse<IUser> = await API.get(apiURL.getUser(userId));
                    setUser(userResponse.data);
                    if (userResponse.data.organizationId) {
                        const teamsInOrganization: AxiosResponse<ITeam[]> = await API.get(apiURL.getTeamsInOrganization(userResponse.data.organizationId));
                        setTeams(teamsInOrganization.data);
                        const organizationInfo: AxiosResponse<IOrganizace> = await API.get(apiURL.getOrganization(userResponse.data.organizationId));
                        setOrganization(organizationInfo.data);
                    } else {
                        throw new Error();
                    }
                } catch (err) {
                    history.push(LINKS.ERROR);
                }
            };
            loadData(token);
        }
    }, [history, token, userId]);

    const onSubmit = async (values: IValues, { setErrors }: FormikHelpers<IValues>) => {
        try {
            const editedUser: EditedUser = {
                email: values.email,
                username: values.username,
            };

            if (!userId) throw new Error();
            const response: AxiosResponse<any> = await API.put(apiURL.putUser(userId), editedUser);
            if (isStatusGeneralSuccess(response.status)) {
                history.push(LINKS.PROFILE);
                setSuccessOpen(true);
            } else {
                throw new Error();
            }
            if (values.password) {
                const response: AxiosResponse<any> = await API.put(apiURL.setNewPassword, { userId, password: values.password });
                if (isStatusGeneralSuccess(response.status)) {
                    history.push(LINKS.PROFILE);
                    setSuccessOpen(true);
                } else {
                    throw new Error();
                }
            }
        } catch (error: any) {
            history.push(LINKS.ERROR);
        }
    };

    if (!user) {
        return <Loading />;
    }

    if (loggedUser && !loggedUser?.isAdmin) {
        return <AccessDenied />;
    }

    return (
        <>
            <Header mobileTitle="Profil uživatele" />
            <Container
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                <Modal modalHeaderText="Editace uživatele" open={successOpen} onClose={() => setSuccessOpen(false)}>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                        <Box mb={5} mx={5}>
                            Vaše změny byly uloženy.
                        </Box>
                        <Box mx="auto" mb={2}>
                            <PrimaryButton type="button" text="Pokračovat" onClick={() => setSuccessOpen(false)} />
                        </Box>
                    </Box>
                </Modal>
                <Grid xs={isDesktop ? 7 : 12} item alignItems="start" container direction="column">
                    {isDesktop && (
                        <PageHeading align="left" variant="h1" color={primaryDark} sx={{ mt: '80px', mb: '86px', ml: '97px' }}>
                            Editace uživatele
                        </PageHeading>
                    )}
                    {user && (
                        <>
                            <SectionWrapper className={isDesktop ? '' : 'mobile'}>
                                <Formik
                                    initialValues={{
                                        email: user.email,
                                        username: user.username,
                                        organizationId: user.organizationId,
                                        teamId: user.teamId,
                                        password: '',
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={onSubmit}
                                    enableReinitialize
                                >
                                    {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                                        return (
                                            <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                                <Box display="flex" flexDirection="column" gap={0} mb={4}>
                                                    <TextInput
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
                                                    <TextInput
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
                                                    <TextInput value={organization?.name || ''} type="text" name="organization" placeholder="Organizace" label="Organizace" disabled />
                                                    <TextInput value={teams && values.teamId ? teams?.[values?.teamId]?.name || '' : ''} type="text" name="teamId" label="Tým" disabled />
                                                    {/* <TextInput
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.password}
                                                        type="password"
                                                        name="password"
                                                        placeholder=""
                                                        label="Heslo*"
                                                        error={touched.password && Boolean(errors.password) ? errors.password : undefined}
                                                    /> */}
                                                </Box>
                                                <ButtonWrapper>
                                                    <PrimaryButton id="submit" text="ULOŽIT" type="submit" disabled={!isValid} />
                                                </ButtonWrapper>
                                            </Form>
                                        );
                                    }}
                                </Formik>
                            </SectionWrapper>
                        </>
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

export default Profile;
