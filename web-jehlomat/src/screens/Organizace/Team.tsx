import { Box, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { SContainer } from 'screens/RegistraceOrganizace/components/RegistrationForm.styled';
import { IData } from './use-organisation';

type props = {
    data: IData;
};

export const Team: FC<props> = ({ data }) => {
    return (
        <SContainer>
            <Typography mb={4} variant="h6" textAlign="center">
                Tým
            </Typography>
            <Box>
                {data.teams.map(team => {
                    return (
                        <>
                            <OutlinedInput
                                value={team.name}
                                type="text"
                                name="teamName"
                                fullWidth
                                sx={{
                                    backgroundColor: '#ffffff38',
                                    color: 'white',
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <Link to={`team/edit/${team.id}`} style={{ all: 'unset' }}>
                                                <EditIcon style={{ color: '#0E766C' }} />
                                            </Link>
                                        </IconButton>
                                    </InputAdornment>
                                }
                                disabled
                            />
                        </>
                    );
                })}
            </Box>
        </SContainer>
    );
};
