import { Typography, Grid, Container, useMediaQuery, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { HeaderMobile } from '../../Components/Header/HeaderMobile';
import { Header } from '../../Components/Header/Header';
import { darkGrey, primaryDark } from '../../utils/colors';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import { media } from '../../utils/media';
import { Formik, Form } from 'formik';
import TextInput from '../../Components/Inputs/TextInput/TextInput';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import API from '../../config/baseURL';
import { AxiosResponse } from 'axios';
import Item from './Item';
import { getUser } from '../../config/user';



const validationSchema = yup.object({
    name: yup.string().required('Název Teamu je povinné pole'),
    location: yup.string().required('Výběr oblasti je povinné pole'),
});


const Team = () => {
    const [location, setLocation] = useState([]);
    const [selectedLocation, setSelectedLocation]: any[] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers]: any[] = useState([]);


    useEffect(() => {
        const getLocation = async () => {
            const response: AxiosResponse<any> = await API.get('/api/v1/jehlomat/location/all');
            return response.data;
        }
        const getMember = async (token: string) => {

            return getUser(token)
                .then(async (user) => {
                    const response: AxiosResponse<any> = await API.get(`/api/v1/jehlomat/organization/${user.organizationId}/users`);
                    console.log(response);
                    return response.data;
                })
                .catch((error) => {
                    console.log(error) //should goes to the error page
                });

        }

        getLocation().then((data) => {
            setLocation(data)
        }).catch((error) => {
            console.log(error) //should redirect to Error page
        });
        
        const token = localStorage.getItem("token");
        console.log("token", token)
        if (token) {
            getMember(token).then((data) => {
                setMembers(data)
            }).catch((error) => {
                console.log(error) //should redirect to Error page
            });
        }

    }, []);

    return (
        <>
            <Header mobileTitle="" />
            <Container maxWidth="lg" sx={{flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Formik
                    initialValues={{ name: '', location: '' }}
                    validationSchema={validationSchema}
                    onSubmit={async () => {
                        try {

                        } catch (error: any) {
                            //link to error page
                        }
                    }}
                >
                    {({ handleSubmit, touched, handleChange, handleBlur, values, errors, isValid }) => {
                        return (
                            <Form onSubmit={handleSubmit}>
                                <TextInput
                                    id="name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    type="text"
                                    name="name"
                                    placeholder="Název Teamu *"
                                    label="Jméno teamu"
                                    required={true}
                                    error={touched.name && Boolean(errors.name) ? errors.name : undefined}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="team-locality">Vyberte oblast působení</InputLabel>
                                    <Select
                                        labelId="team-locality-label"
                                        id="team-locality-select"
                                        name="location"
                                        value={values.location}
                                        label="Vyberte oblast působení"
                                        onChange={(event) => {
                                            handleChange(event);
                                            const data = selectedLocation;
                                            data.push(event.target.value);
                                            setSelectedLocation(data);
                                        }}
                                    >
                                        {location.map((place: any) => {
                                            return (<MenuItem key={place.id} id={place.id} value={place.name}>{place.name}</MenuItem>)
                                        })}
                                    </Select>
                                </FormControl>
                                <div>
                                    {selectedLocation.map((place: string) => {
                                        return (<Item data={place}></Item>)
                                    })}
                                </div>
                                <FormControl fullWidth>
                                    <InputLabel id="team-member">Vyberte členy týmu</InputLabel>
                                    <Select
                                        labelId="team-member-label"
                                        id="team-member-select"
                                        name="member"
                                        value={values.location}
                                        label="Vyberte členy týmu"
                                        onChange={(event) => {
                                            handleChange(event);
                                            const data = selectedMembers;
                                            data.push(event.target.value);
                                            setSelectedMembers(data);
                                        }}
                                    >
                                        {members.map((member: any) => {
                                            return (<MenuItem key={member.id} id={member.id} value={member.name}>{member.name}</MenuItem>)
                                        })}
                                    </Select>
                                </FormControl>
                            </Form>
                        )
                    }}
                </Formik>
            </Container>
        </>
    )
}
export default Team;