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
    ListWrapper,
    ListHeader,
    ListHeaderItem,
    ListItem,
    ListItemCell,
    SyringeIcon,
    EditIcon,
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
                {/* Nadpis & filter */}
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
                        {/* Sortable header */}
                        <thead>
                        <ListHeader>
                            <ListHeaderItem />
                            <ListHeaderItem />
                            <ListHeaderItem>Město</ListHeaderItem>
                            <ListHeaderItem>Název</ListHeaderItem>
                            <ListHeaderItem>Datum nálezu</ListHeaderItem>
                            <ListHeaderItem>Datum likvidace</ListHeaderItem>
                            <ListHeaderItem>Zadavatel</ListHeaderItem>
                            <ListHeaderItem>Stav</ListHeaderItem>
                            <ListHeaderItem />
                        </ListHeader>
                        </thead>

                        {/* Items */}
                        <tbody>
                            <ListItem>
                                <ListItemCell style={{
                                    paddingLeft: '14px'
                                }}>
                                    1
                                </ListItemCell>
                                <ListItemCell><SyringeIcon/></ListItemCell>
                                <ListItemCell>Benešov</ListItemCell>
                                <ListItemCell>Benešov - u hřiště</ListItemCell>
                                <ListItemCell>15. 4. 2021</ListItemCell>
                                <ListItemCell>zatím nezlikvidováno</ListItemCell>
                                <ListItemCell>Magdalena</ListItemCell>
                                <ListItemCell>Čeká na likvidaci</ListItemCell>
                                <ListItemCell><EditIcon /></ListItemCell>
                                {/* V designe je este radio button, ale nepozname 
                                dovod preco, takze zatim neni implementovany */}
                            </ListItem>
                            <ListItem>
                                <ListItemCell style={{
                                    paddingLeft: '14px'
                                }}>
                                    2
                                </ListItemCell>
                                <ListItemCell><SyringeIcon/></ListItemCell>
                                <ListItemCell>Praha</ListItemCell>
                                <ListItemCell>Anděl</ListItemCell>
                                <ListItemCell>15. 3. 2021</ListItemCell>
                                <ListItemCell>zatím nezlikvidováno</ListItemCell>
                                <ListItemCell>Magdalena</ListItemCell>
                                <ListItemCell>Čeká na likvidaci</ListItemCell>
                                <ListItemCell><EditIcon /></ListItemCell>
                            </ListItem>
                            <ListItem>
                                <ListItemCell style={{
                                    paddingLeft: '14px'
                                }}>3</ListItemCell>
                                <ListItemCell><SyringeIcon/></ListItemCell>
                                <ListItemCell>Praha</ListItemCell>
                                <ListItemCell>Anděl</ListItemCell>
                                <ListItemCell>15. 3. 2021</ListItemCell>
                                <ListItemCell>zatím nezlikvidováno</ListItemCell>
                                <ListItemCell>Magdalena</ListItemCell>
                                <ListItemCell>Čeká na likvidaci</ListItemCell>
                                <ListItemCell><EditIcon /></ListItemCell>
                            </ListItem>
                            <ListItem>
                                <ListItemCell style={{
                                    paddingLeft: '14px'
                                }}>
                                    4
                                </ListItemCell>
                                <ListItemCell><SyringeIcon/></ListItemCell>
                                <ListItemCell>Praha</ListItemCell>
                                <ListItemCell>Anděl</ListItemCell>
                                <ListItemCell>15. 3. 2021</ListItemCell>
                                <ListItemCell>zatím nezlikvidováno</ListItemCell>
                                <ListItemCell>Magdalena</ListItemCell>
                                <ListItemCell>Čeká na likvidaci</ListItemCell>
                                <ListItemCell><EditIcon /></ListItemCell>
                            </ListItem>
                        </tbody>

                    </ListWrapper>
                </Box>
            </Box>
        </>
    );
};

export default NavodLikvidace;
