import { FC, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import TitleBar from '../../Components/Navigation/TitleBar';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import API from '../../config/baseURL';
import { AxiosResponse } from 'axios';
import { Container } from '@mui/material';
import { white } from '../../utils/colors';
import { ChevronLeft } from '@mui/icons-material';
import {getToken} from "utils/login";
import { getUser } from 'config/user';

const Login: FC<any> = () => {
    let history = useHistory();

    const [user, setUser] = useState('');



    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            getUser(token)
            .then((data)=>{
                setUser(data.username);
                console.log(data);
            })
            .catch((error) => {
                console.log(error) //should goes to the error page
            });
        }
    }, []);

    return (
        <Container sx={{ height: '100vh', width: '100%' }}>
            <Grid container justifyContent="start" sx={{ height: '100%', width: '100%' }}>
                <TitleBar
                    icon={<ChevronLeft sx={{ color: white, fontSize: 40 }} />}
                    onIconClick={() => {
                        history.goBack();
                    }}
                ></TitleBar>
                <Grid container direction="column" sx={{ height: '100%', width: '100%' }} justifyContent="start" alignItems="center">
                    {user}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Login;
