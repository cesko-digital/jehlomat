import { FC, useEffect, useState } from 'react';
import PrimaryButton from '../Components/Buttons/PrimaryButton/PrimaryButton';
import TextButton from '../Components/Buttons/TextButton/TextButton';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import TitleBar from '../Components/Navigation/TitleBar';
import jwt_decode from "jwt-decode";


import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Form, Formik } from 'formik';
import TextInput from '../Components/Inputs/TextInput/TextInput';
import API from '../config/baseURL';
import { AxiosResponse } from 'axios';
import { Container, useMediaQuery } from '@mui/material';
import { primary, white, secondary } from '../Components/Utils/Colors';
import { ChevronLeft } from '@mui/icons-material';



const Login: FC<any> = () => {

    let history = useHistory();
    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up('sm'));

    const [user, setUser] = useState("");


    interface IResponse {
        id: number;
        email?: string;
        username: string;
        password?: string;
        organizationId: number;
        teamId: number;
        isAdmin?: boolean;
        verified?: boolean;
    }

    interface IToken {
        "aud": string;
        "user-id": string;
        "iss": string;
        "exp": string;
    }

    const getMe = (token: string) => {
        const decoded: IToken = jwt_decode(token);
        return decoded["user-id"];
    }

    useEffect(() => {

        const getUser = async (token: string) => {
            const response: AxiosResponse<IResponse> = await API.get("/api/v1/jehlomat/user/" + getMe(token));
            return response.data.username;
        }

        const token = localStorage.getItem("token");

        if (token) {
            getUser(token)
            .then((user)=>{
                setUser(user);
                console.log(user);
            })
            .catch((error) => {
                console.log(error) //should goes to the error page
            });
        }
    }, []);



    return (
        <Container sx={{ height: '100vh', width: '100%' }}>
            <Grid container justifyContent="start" sx={{ height: '100%', width: '100%' }}>
                <TitleBar icon={<ChevronLeft sx={{ color: white, fontSize: 40 }} />} onIconClick={() => { history.goBack() }}></TitleBar>
                <Grid container direction="column" sx={{ height: '100%', width: '100%' }} justifyContent="start" alignItems="center">
                    {user}
                </Grid>
            </Grid>
        </Container>
    );
}

export default Login;
