import { Typography, Grid, Container, useMediaQuery, FormControl, InputLabel, Select, MenuItem, touchRippleClasses, FormHelperText } from '@mui/material';
import { Header } from '../../Components/Header/Header';
import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
import { media } from '../../utils/media';
import { Formik, Form } from 'formik';
import TextInput from '../../Components/Inputs/TextInput/TextInput';
import * as yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { API } from '../../config/baseURL';
import { AxiosResponse } from 'axios';
import Item from './Item';
import { getUser, IResponse } from '../../config/user';
import { tokenState } from 'store/login';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import _ from 'lodash';
import Box from '@mui/material/Box';
import { MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import { DEFAULT_POSITION, DEFAULT_ZOOM_LEVEL } from '../NovyNalez/constants';
import 'leaflet/dist/leaflet.css';
import { Label } from 'Components/Inputs/shared';
import { primary } from 'utils/colors';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import MapModal from './components/MapModal';
import { LINKS } from 'routes';
import { isStatusConflictError, isStatusGeneralSuccess } from 'utils/payload-status';
import { useHistory, useLocation, useParams } from 'react-router';
import { IUser , IUserEdited} from 'types';
import ConfirmModal from './components/ConfirmModal';

interface ILocation {
    id: string,
    type: string,
    name?: string
}

interface ILocationResponse {
    id: 0,
    okres: string,
    okresName: string,
    obec: string,
    obecName: string,
    mestkaCast: string,
    mestkaCastName: string
}
interface ITeam {
    name: string,
    locationIds: ILocation[],
    organizationId: number
}
interface ITeamResponse {
    id: number,
    name: string,
    locations: ILocation[],
    organizationId: number
}
interface IRouteParams {
    teamId?: string;
}

const Map = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 500px;
    flex-grow: 1;
    padding: 1em;
    @media (max-width: 700px) {
        // compensate parent padding, nasty but easiest
        width: 100vw;
        height: 100vh;
        padding: 0em;
    }
    `;
const FormContainer = styled(Container)`
    display: flex;
    flexDirection: column;
    ustifyContent: center;
    alignItems: flex-start;
    flexWrap: wrap;
    padding: 1em 0 1em 0;
    width: 50%;
    height: 100%;
    @media (max-width: 700px) {
        width: 100%;
        padding: 1em 1em 1em 1em;
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

const Team = (props: any) => {
    const [logUser, setUser]: any = useState()
    const [location, setLocation] = useState([]);
    const [geom, setGeom]: any[] = useState([]);
    const [teamName, setTeamName] = useState('')
    const [selectedLocation, setSelectedLocation]: any[] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers]: any[] = useState([]);
    const token = useRecoilValue(tokenState);
    const isMobile = useMediaQuery(media.lte('mobile'));
    const [showModal, setShowModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const hideModal = useCallback(() => {
        setShowModal(false);
    }, []);
    const { teamId } = useParams<IRouteParams>();
    const path = useLocation();  
    const isEdit: boolean = path.pathname.includes('edit')?true:false

    const titleText = path.pathname.includes('edit')?'Editace teamu':'Přidat nový tým';

    const history = useHistory();
    
    //console.log(teamId, path)

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
        var data = _.remove(arr, function (n) {
            return n.id !== val.id;
        });

        data.push(val)
        return data;
    }
    useEffect(() => {
        if(isEdit){
            API.get<ITeamResponse>(`/team/${teamId}`).then((response)=>{
                if(isStatusGeneralSuccess(response.status)){
                    const team = response.data;
                    setTeamName(team.name);
                    console.log(team.name, teamName);
                    setSelectedLocation(team.locations);
                } else {
                    history.push(LINKS.ERROR);
                }
                
            });
            API.get<IUser>(`/team/${teamId}/users`).then((response)=>{
                const users = response.data;
                setSelectedMembers(users)
            });
        }
    }, [isEdit, teamName])

    useEffect(() => {
        const selectedGeometry: any[] = []
        selectedLocation.map(async (place: any, id: number) => {
            const geometry = await getGeometry(place.type, place.id).then((data) => {
                const transformGeom: any[] = [];
                data.coordinates[0].map((coordinate: any) => {
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
                    setUser(user);
                    const response: AxiosResponse<any> = await API.get(`/organization/${user.organizationId}/users`);
                    return response.data;
                })
                .catch((error) => {
                    history.push(LINKS.ERROR);
                });

        }

        getLocation().then((data) => {
            setLocation(data)
        }).catch((error) => {
            history.push(LINKS.ERROR);
        });
        if (token) {
            getMember(token).then((data) => {
                setMembers(data)
            }).catch((error) => {
                history.push(LINKS.LOGIN);
            });
        }
    }, [selectedLocation, selectedMembers, token]);

    function GetBoundary() {
        const map = useMap();
        if (geom.length > 0) {
            map.fitBounds(geom)
        };
        return null;
    }

    function BasicMap(props: { display: boolean, borderRadius: string }) {
        const show = props.display ? 'block' : 'none';
        const label = props.display ? 'none' : 'block';
        return (
            <Map id="map-container" style={{ display: show }}>
                <Label style={{ display: label }}>Oblast na mapě</Label>
                <Box position="relative" width="100%" height="100%" >
                    <MapContainer
                        center={DEFAULT_POSITION}
                        zoom={DEFAULT_ZOOM_LEVEL}
                        scrollWheelZoom={false}
                        style={{ width: `100%`, height: `100%`, zIndex: 1, borderRadius: props.borderRadius }}
                        dragging={true}
                        doubleClickZoom={true}
                        preferCanvas
                    >
                        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {
                            geom.map((geometry: any, id: any) => {
                                return (<Polygon key={id} pathOptions={{ color: 'purple' }} positions={geometry} />)
                            })
                        }
                        <GetBoundary />
                    </MapContainer>
                </Box>
            </Map>
        )
    }

    const initialValues = useMemo(
        () => ({ name: teamName, location: { id: '', name: '', type: '' }, member: '' }),
        [teamName],
    );

    return (
        <>
            <Header mobileTitle={titleText} backRoute={LINKS.HOME} />
            <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', flexWrap: 'wrap', width: '100%', height: '100%' }}>
                <Typography display={['none', 'flex']} mb={4} variant="h6" textAlign="center" sx={{ color: primary, fontWeight: 400, padding: '2em 1em 1em 2em', margin: 0 }}>
                    {titleText}
                </Typography>
                <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', flexWrap: 'wrap', padding: '1em 0 1em 0', width: '100%', height: '100%' }}>
                    <FormContainer>
                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { setErrors }) => {
                                try {

                                    const geoLocation = _.cloneDeep(selectedLocation);
                                    const team: ITeam = {
                                        name: values.name,
                                        locationIds: geoLocation.map((element: ILocation) => {
                                            delete element.name;
                                            return element;
                                        }),
                                        organizationId: logUser.organizationId
                                    }
                                    const teamResponse: AxiosResponse<any> = await API.post(`/team`, team);
                                    switch (true) {
                                        case isStatusGeneralSuccess(teamResponse.status): {
                                            console.log("team", teamResponse.data);
                                            selectedMembers.map(async (user: IUser) => {
                                                if (teamResponse.data && teamResponse.data.id) {
                                                    let userEdited:IUserEdited = _.cloneDeep(user);
                                                    userEdited.teamId = teamResponse.data.id;
                                                    delete userEdited.id;
                                                    delete userEdited.organizationId;
                                                    delete userEdited.isAdmin;
                                                    delete userEdited.verified;

                                                    console.log(userEdited)
                                                    //delete userEdited.id;
                                                    const userResponse: AxiosResponse<any> = await API.put(`/user/${user.id}/attributes`, userEdited);
                                                    isStatusGeneralSuccess(userResponse.status)?setConfirmModal(true):history.push(LINKS.ERROR);
                                                }
                                            })
                                            break;
                                        }
                                        case isStatusConflictError(teamResponse.status): {
                                            //for validation error;
                                            setErrors({ 'name': 'Zvolte jiný název teamu. Název teamu již existuje!' });
                                            break;
                                        }
                                        default: {
                                            if (geoLocation.length === 0) {
                                                //location empty validation error
                                                setErrors({ 'location': { id: '', name: 'Zvolte jiný název teamu. Název teamu již existuje!', type: '' } });
                                            } else {
                                                history.push(LINKS.ERROR);
                                            }
                                            break;
                                        }
                                    }
                                    console.log(selectedMembers, selectedLocation);
                                    const response: AxiosResponse<any> = await API.get(`/organization/${logUser.organizationId}`);
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
                                                error={touched.location && Boolean(errors.location)}
                                            >
                                                {location.map((place: any) => {
                                                    return (<MenuItem key={place.id} id={place.id} value={place}>{`${place.type} - ${place.name}`}</MenuItem>)
                                                })}
                                            </Select>
                                            <FormHelperText error={true}>
                                                {touched.location && errors.location ? errors.location.name : undefined}
                                            </FormHelperText>
                                        </StyledFormControl>
                                        {isMobile ? <SecondaryButton id="submit" text="Lokalita na mapě" type="button" style={{ fontWeight: 100 }} onClick={() => { setShowModal(true) }} /> : null}
                                        <SelectList>
                                            {selectedLocation.map((place: any, id: number) => {
                                                return (<Item key={id} id={place.id} name={`${place.type} - ${place.name}`} remove={removeLocation} />)
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
                                                    setSelectedMembers([...data]);
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
                    </FormContainer>
                    <BasicMap borderRadius='10px' display={isMobile ? false : true} />
                </Container>
            </Container>
            <MapModal open={showModal} close={hideModal}>
                <BasicMap borderRadius='0px' display={true} />
            </MapModal>
            <ConfirmModal open={confirmModal} close={setConfirmModal}>
                <Container sx={{ flexGrow: 1, 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                padding: 0
                                }}>
                    <div style={{width: '100%', marginTop: '15px', marginBottom: '15px', textAlign: 'center'}}>Založení teamu probehlo úspěšně</div>
                    <PrimaryButton text="ok" 
                        onClick={()=>{
                            setConfirmModal(false);
                            history.goBack()
                        }}
                    />
                </Container>
            </ConfirmModal>
        </>
    )
}
export default Team;