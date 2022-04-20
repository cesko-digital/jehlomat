import { Typography, Grid, Container, useMediaQuery, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Header } from '../../Components/Header/Header';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import { media } from '../../utils/media';
import { Formik, Form } from 'formik';
import TextInput from '../../Components/Inputs/TextInput/TextInput';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { API } from '../../config/baseURL';
import { AxiosResponse } from 'axios';
import Item from './Item';
import { getUser } from '../../config/user';
import { tokenState } from 'store/login';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import _ from 'lodash';
import Box from '@mui/material/Box';
import L, { LatLngExpression } from 'leaflet';
import { MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from '../NovyNalez/constants';
import 'leaflet/dist/leaflet.css';
import { Label } from 'Components/Inputs/shared';
import { primary } from 'utils/colors';

const Map = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 500px;
    flex-grow: 1;
    padding: 1em;
    border-radius: 25px;
    @media (max-width: 700px) {
        // compensate parent padding, nasty but easiest
        width: 100vw;
        transform: translateX(-16px);
        height: 80vh;
    }
`;

const StyledFormControl = styled(FormControl)`
    padding: 0.5em 0 0.5em 0;
`;

const SelectList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

const validationSchema = yup.object({
    name: yup.string().required('Název Teamu je povinné pole'),
});

const Team = () => {
    const [location, setLocation] = useState([]);
    const [geom, setGeom]: any[] = useState([]);
    const [selectedLocation, setSelectedLocation]: any[] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers]: any[] = useState([]);
    const token = useRecoilValue(tokenState);

    const getGeometry = async (type: string, id: string) => {
        const response: AxiosResponse<any> = await API.get(`/location/geometry?type=${type}&id=${id}`);
        return response.data;
    }

    const removeLocation = (item: any) => {
        const data = selectedLocation;
        _.remove(data, {
            id: item
        });
        setSelectedLocation([...data]);
    }

    const removeMembers = (item: any) => {
        const data = selectedMembers;
        _.remove(data, {
            id: item
        });
        setSelectedMembers([...data]);
    }

    function knock(arr: Array<any>, val: any) {
        _.pull(arr, val);
        arr.push(val)
        return arr;
    }

    useEffect(()=>{
        const selectedGeometry:any[] = []
        selectedLocation.map(async (place: any, id: number) => {
            const geometry =  await getGeometry(place.type, place.id).then((data) => {
                const transformGeom: any[] = [];
                data.coordinates[0].map((coordinate:any)=>{
                    //console.log("coordinates", coordinate);
                    transformGeom.push([coordinate[1], coordinate[0]]);
                });
                return transformGeom;
            });
            selectedGeometry.push(geometry);
        });
        setGeom(selectedGeometry);
    }, [selectedLocation])

    useEffect(() => {
        const getLocation = async () => {
            const response: AxiosResponse<any> = await API.get('/location/all');
            return response.data;
        }
        const getMember = async (token: string) => {

            return getUser(token)
                .then(async (user) => {
                    const response: AxiosResponse<any> = await API.get(`/organization/${user.organizationId}/users`);
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
        if (token) {
            getMember(token).then((data) => {
                setMembers(data)
            }).catch((error) => {
                console.log(error) //should redirect to Error page
            });
        }
    }, [selectedLocation, selectedMembers, token]);

    function GetBoundary(){
        const map = useMap();
        if(geom.length > 0){
            map.fitBounds(geom)
        };
        return null;
    }

    return (
        <>
            <Header mobileTitle="" />
            <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', flexWrap: 'wrap', width: '100%', height: '100%' }}>
                <Typography display={['none', 'flex']} mb={4} variant="h6" textAlign="center" sx={{ color: primary, fontWeight: 400, padding: '2em 1em 1em 2em', margin: 0 }}>
                    Přidat nový tým
                </Typography>
                <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', flexWrap: 'wrap', padding: '1em 0 1em 0', width: '100%', height: '100%' }}>
                    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', padding: '1em 0 1em 0', width: '50%', height: '100%' }}>
                        <Formik
                            initialValues={{ name: '', location: { id: '', name: '', type: '' }, member: '' }}
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
                                    <Form onSubmit={handleSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '509px' }}>
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
                                            <Label htmlFor="team-locality-select">Vyberte území týmu</Label>
                                            <Select
                                                id="team-locality-select"
                                                name="location"
                                                value={values.location}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                    const data = knock(selectedLocation, event.target.value);
                                                    setSelectedLocation([...data]);
                                                }}
                                            >
                                                {location.map((place: any) => {
                                                    return (<MenuItem key={place.id} id={place.id} value={place}>{`${place.type} - ${place.name}`}</MenuItem>)
                                                })}
                                            </Select>
                                        </StyledFormControl>
                                        <SelectList>
                                            {selectedLocation.map((place: any, id: number) => {
                                                return (<Item key={id} id={place.id} name={`${place.type} - ${place.name}`} remove={removeLocation}></Item>)
                                            })}
                                        </SelectList>
                                        <StyledFormControl fullWidth>
                                            <Label htmlFor="team-member-select">Vyberte členy týmu</Label>
                                            <Select
                                                id="team-member-select"
                                                name="member"
                                                value={values.member}
                                                label="Vyberte členy týmu"
                                                onChange={(event) => {
                                                    handleChange(event);
                                                    const data = knock(selectedMembers, event.target.value);
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
                                        <PrimaryButton id="submit" text="PŘIDAT TEAM" type="submit" disabled={!isValid} style={{ maxWidth: '203px' }} />
                                    </Form>
                                )
                            }}
                        </Formik>
                    </Container>
                    <Map id="map-container">
                        <Label>Vyberte oblast na mapě</Label>
                        <Box position="relative" width="100%" height="100%" >
                            <MapContainer
                                center={DEFAULT_POSITION}
                                zoom={DEFAULT_ZOOM_LEVEL}
                                scrollWheelZoom={false}
                                style={{ width: `100%`, height: `100%`, zIndex: 1, borderRadius: '10px' }}
                                dragging={true}
                                doubleClickZoom={true}
                                preferCanvas
                            >
                                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {
                                    geom.map((geometry: any, id: any) => {
                                        return(<Polygon key={id} pathOptions={{ color: 'purple' }} positions={geometry} />)
                                    })
                                }
                                <GetBoundary/>
                            </MapContainer>
                        </Box>
                    </Map>
                </Container>
            </Container>

        </>
    )
}
export default Team;