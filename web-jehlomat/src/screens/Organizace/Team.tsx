import { Typography } from "@mui/material";
import { FC } from "react";
import { SContainer } from "screens/RegistraceOrganizace/components/RegistrationForm.styled";

export const Team: FC = () => {
    return (
        <SContainer>
            <Typography mb={4} variant="h6" textAlign="center">
                Tým
            </Typography>
        </SContainer>
    )
}
