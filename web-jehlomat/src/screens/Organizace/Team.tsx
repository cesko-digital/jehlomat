import { Box, IconButton, InputAdornment, OutlinedInput, Typography, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { SContainer } from 'screens/RegistraceOrganizace/components/RegistrationForm.styled';
import { IData } from './use-organisation';
import { media } from 'utils/media';
import PrimaryButton from 'Components/Buttons/PrimaryButton/PrimaryButton';
import SecondaryButton from 'Components/Buttons/SecondaryButton/SecondaryButton';
import { ITeam } from 'types';

type props = {
    data: IData;
};

export const Team: FC<props> = ({ data }) => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <SContainer>
            <Typography mb={4} variant="h6" textAlign="center">
                Tým
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={5}>
                {data.teams.length ? data.teams.map((team: ITeam) => {
                    return (
                        <>
                            <OutlinedInput
                                value={team.name}
                                type="text"
                                name="teamName"
                                fullWidth
                                label={
                                    <Typography
                                        sx={{
                                            visibility: 'visible',
                                            marginTop: '35px',
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        {/* TODO get number of team members from BE */}x členů
                                    </Typography>
                                }
                                sx={{
                                    backgroundColor: '#ffffff38',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        ...(!isMobile && { border: 'none' }),
                                    },
                                }}
                                inputProps={{
                                    sx: {
                                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)!important',
                                        ...(!isMobile && {
                                            WebkitTextFillColor: '#fff!important',
                                        }),
                                        padding: '8px 14px 25px 14px',
                                    },
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <Link to={`/team/edit/${team.id}`} style={{ all: 'unset' }}>
                                                <EditIcon style={{ ...(!isMobile && { color: '#fff' }) }} />
                                            </Link>
                                        </IconButton>
                                    </InputAdornment>
                                }
                                disabled
                            />
                        </>
                    );
                }) : "Žádný tým" }
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Link to="/team/novy">{isMobile ? <PrimaryButton text="Přidat tým" /> : <SecondaryButton text="Přidat tým" />}</Link>
            </Box>
        </SContainer>
    );
};
