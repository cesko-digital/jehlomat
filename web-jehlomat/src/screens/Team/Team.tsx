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
import API, { authorizedAPI } from '../../config/baseURL';
import { AxiosResponse } from 'axios';
import Item from './Item';
import { getUser } from '../../config/user';
import { getToken } from 'utils/login';
import styled from '@emotion/styled';
import _ from 'lodash';

const StyledFormControl = styled(FormControl)`
    padding: 0.5em 0 0.5em 0;
`;

const SelectList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
`;

const validationSchema = yup.object({
    name: yup.string().required('Název Teamu je povinné pole'),
});

const Team = () => {
    const [location, setLocation] = useState([]);
    const [selectedLocation, setSelectedLocation]: any[] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers]: any[] = useState([]);

    const removeLocation = (item: any)=>{
        const data = selectedLocation;
        _.remove(data, {
            id: item
        });
        setSelectedLocation([...data]);
    }

    const removeMembers = (item: any)=>{
        const data = selectedMembers;
        _.remove(data, {
            id: item
        });
        setSelectedMembers([...data]);
    }


    useEffect(() => {
        const getLocation = async () => {
            const response: AxiosResponse<any> = await API.get('/api/v1/jehlomat/location/all');
            return response.data;
        }
        const getMember = async (token: string) => {

            return getUser(token)
                .then(async (user) => {
                    const response: AxiosResponse<any> = await authorizedAPI.get(`/api/v1/jehlomat/organization/${user.organizationId}/users`);
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
        const token = getToken();
        if (token) {
            getMember(token).then((data) => {
                setMembers(data)
            }).catch((error) => {
                console.log(error) //should redirect to Error page
            });
        }
        console.log(selectedMembers)
    }, [selectedLocation, selectedMembers]);

    return (
        <>
            <Header mobileTitle="" />
            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', padding: '1em 0 1em 0'}}>
                <Formik
                    initialValues={{ name: '', location: {id: '', name: '', type: ''}, member: '' }}
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
                                <StyledFormControl fullWidth>
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
                                </StyledFormControl>
                                <StyledFormControl fullWidth>
                                    <label htmlFor="team-locality-select">Vyberte území týmu</label>
                                    <Select
                                        id="team-locality-select"
                                        name="location"
                                        value={values.location}
                                        onChange={(event) => {
                                            console.log(event.target.value)
                                            handleChange(event);
                                            const data = selectedLocation;
                                            data.push(event.target.value);
                                            setSelectedLocation(data);
                                        }}
                                    >
                                        {location.map((place: any) => {
                                            return (<MenuItem key={place.id} id={place.id} value={place}>{place.name}</MenuItem>)
                                        })}
                                    </Select>
                                </StyledFormControl>
                                <SelectList>
                                    {selectedLocation.map((place: any, id: number) => {
                                        return (<Item key={id} id={place.id} name={place.name} remove={removeLocation}></Item>)
                                    })}
                                </SelectList>
                                <StyledFormControl fullWidth>
                                    <label htmlFor="team-member-select">Vyberte členy týmu</label>
                                    <Select
                                        id="team-member-select"
                                        name="member"
                                        value={values.member}
                                        label="Vyberte členy týmu"
                                        onChange={(event) => {
                                            handleChange(event);
                                            const data = selectedMembers;
                                            data.push(event.target.value);
                                            setSelectedMembers(data);
                                        }}
                                    >
                                        {members.map((member: any) => {
                                            return (<MenuItem key={member.id} id={member.id} value={member}>{member.username}</MenuItem>)
                                        })}
                                    </Select>
                                </StyledFormControl>
                                <SelectList>
                                    {selectedMembers.map((member: any, id: number) => {
                                        return (<Item key={id} id={member.id} name={member.username} remove={removeMembers}></Item>)
                                    })}
                                </SelectList>
                                <PrimaryButton id="submit" text="Založit Team" type="submit" disabled={!isValid} />
                            </Form>
                        )
                    }}
                </Formik>
            </Container>
        </>
    )
}
export default Team;