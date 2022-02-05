import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// import Card from './components/Card';
// import styled from '@emotion/styled';
// import { secondary } from '../../utils/colors';
// import PrimaryButton from '../../Components/Buttons/PrimaryButton/PrimaryButton';
// import TextButton from '../../Components/Buttons/TextButton/TextButton';
import { Header } from '../../Components/Header/Header';
// import { Link } from 'react-router-dom';
// import { LINKS } from '../../utils/links';
import { useMediaQuery } from '@mui/material';
import { 
    TextHeader, 
    FilterLink,
    ListWrapper 
} from './NalezyStyles';
import { media } from '../../utils/media';
import SearchInput from '../../Components/Inputs/SearchInput/SearchInput';
import SearchInputDesktop 
    from '../../Components/Inputs/SearchInput/SearchInputDesktop';

interface Props {}

const NavodLikvidace: FC<Props> = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));

    return (
        <>
            <Header mobileTitle="Seznam zadaných nálezů" />

            {!isMobile && (
                // mobilne komponenty
                <></>
            )}

            <Box 
                maxWidth={1300}
                width={1} 
                ml="auto"
                mr="auto" 
                minHeight={'100vh'} 
                mt={8}
            >
                <Grid container 
                    direction="row" alignItems="center" 
                    justifyContent="space-between"
                >
                    <Box>
                        <TextHeader>Seznam zadaných nálezů</TextHeader>
                    </Box>
                    {isMobile && (
                        // mobile komponenta
                        <Box>
                            <SearchInput
                                placeholder="Hledat"
                            />
                        </Box>
                    )}
                    <Box>
                        {!isMobile && (
                            // desktop komponenta
                            <SearchInputDesktop
                                placeholder="Hledat"
                            />
                        )}
                        <FilterLink href="#">Filtrovat</FilterLink>
                        <FilterLink href="#">Vybrat vše</FilterLink>
                        <FilterLink href="#">Exportovat vybrané</FilterLink>
                    </Box>
                </Grid>
                <Box mt={2}>
                    <ListWrapper>
                        test
                    </ListWrapper>
                </Box>
            </Box>
        </>
    );
};

export default NavodLikvidace;
