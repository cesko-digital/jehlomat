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

const Login: FC<any> = () => {
    let history = useHistory();

    const [user, setUser] = useState('');

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
        aud: string;
        'user-id': string;
        iss: string;
        exp: string;
    }

    useEffect(() => {
        const getMe = (token: string) => {
            const decoded: IToken = jwt_decode(token);
            return decoded['user-id'];
        };
        const getUser = async (token: string) => {
            const response: AxiosResponse<IResponse> = await API.get('/api/v1/jehlomat/user/' + getMe(token));
            return response.data.username;
        };

        const token = localStorage.getItem('token');

        if (token) {
            getUser(token)
                .then(user => {
                    setUser(user);
                    console.log(user);
                })
                .catch(error => {
                    console.log(error); //should goes to the error page
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
