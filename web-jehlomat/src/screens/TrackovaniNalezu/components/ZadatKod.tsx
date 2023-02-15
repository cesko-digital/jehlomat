import React, { FC, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import TextInput from '../../../Components/Inputs/TextInput/TextInput';
import PrimaryButton from '../../../Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../../../Components/Buttons/TextButton/TextButton';
import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { primaryDark } from '../../../utils/colors';
import { STEPS, SyringeStateType } from 'screens/TrackovaniNalezu/TrackovaniNalezu.config';
import API from '../../../config/baseURL';
import { isStatusGeneralSuccess, isStatusConflictError, isStatusNotFound } from 'utils/payload-status';
import apiURL from 'utils/api-url';

const validationSchema = yup.object({
    kod: yup.string().length(8, 'Trackovaí kód musí mít přesně 8 znaků.').required('Trackovací kód je povivnný.'),
});

interface IZadatKod {
    onClickBack: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleStepChange: (newStep: STEPS) => void;
    handleNewSyringeState: (syringeState: SyringeStateType) => void;
    height: string;
}

interface IRouteParams {
    trackId?: string;
}

const ZadatKod: FC<IZadatKod> = ({ onClickBack, handleStepChange, handleNewSyringeState, height }) => {
    const history = useHistory();

    const handleOnClickBackButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClickBack(event);
    };

    const handleOnError = () => {
        history.push('/error');
    };

    const [code, setCode] = useState('');
    const { trackId } = useParams<IRouteParams>();

    useEffect(() => {
        if (trackId) {
            setCode(trackId);
        }
    }, [trackId]);

    return (
        <Container maxWidth="xs" sx={{ height, display: 'flex', flexGrow: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Typography align="center" variant="body1" fontWeight="bold" color={primaryDark}>
                        Pro zobrazení stavu nálezu, zadejte prosím trasovací kód.
                    </Typography>
                    <Box sx={{ mt: '2rem', width: '100%' }}>
                        <Formik
                            enableReinitialize
                            initialValues={{ kod: code }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setErrors }) => {
                                try {
                                    const response: AxiosResponse<any> = await API.get(apiURL.getSyringeInfo(values.kod));
                                    const { status } = response;

                                    switch (true) {
                                        case isStatusGeneralSuccess(status): {
                                            const { data } = response;

                                            if (data.status === SyringeStateType.DEMOLISHED) {
                                                handleNewSyringeState(SyringeStateType.DEMOLISHED);
                                            } else if (data.status === SyringeStateType.ANNOUNCED) {
                                                handleNewSyringeState(SyringeStateType.ANNOUNCED);
                                            } else {
                                                handleNewSyringeState(SyringeStateType.WAITING);
                                            }

                                            handleStepChange(STEPS.ZobrazitStav);
                                            break;
                                        }
                                        case isStatusNotFound(status): {
                                            handleNewSyringeState(SyringeStateType.NOTFOUND);
                                            handleStepChange(STEPS.ZobrazitStav);
                                            break;
                                        }
                                        case isStatusConflictError(status): {
                                            const fieldName = response.data.fieldName;
                                            setErrors({ [fieldName]: response.data.status });
                                            break;
                                        }
                                        default: {
                                            handleOnError();
                                            break;
                                        }
                                    }
                                } catch (error: any) {
                                    handleOnError();
                                }
                            }}
                        >
                            {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                                return (
                                    <Form onSubmit={handleSubmit}>
                                        <Grid container direction="column" justifyContent="center" alignItems="center">
                                            <TextInput
                                                id="kod"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.kod}
                                                type="text"
                                                name="kod"
                                                label="Trasovací kód nálezu"
                                                required={true}
                                                error={touched.kod && Boolean(errors.kod) ? errors.kod : undefined}
                                            />
                                            <Box sx={{ mt: '3rem', mb: '1rem' }}>
                                                <PrimaryButton id="submit" text="Potvrdit" type="submit" disabled={!isValid} />
                                            </Box>
                                        </Grid>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </Box>
                    <TextButton text="Zpět" type="button" onClick={handleOnClickBackButton} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default ZadatKod;
