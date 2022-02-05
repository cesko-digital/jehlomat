import React, { useState, FC } from 'react';
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
    CheckboxRadio,
    TextMuted,
    TextMutedBold,
    TextGold,
    TextHighlight
} from './NalezyStyles';
import { media } from '../../utils/media';
import SearchInput from '../../Components/Inputs/SearchInput/SearchInput';
import SearchInputDesktop 
    from '../../Components/Inputs/SearchInput/SearchInputDesktop';
import { syringeMock } from './syringeMock'
import dayjs from 'dayjs'

dayjs().format()

interface Props {}

const NavodLikvidace: FC<Props> = () => {
    const isMobile = useMediaQuery(media.lte('mobile'));
    const [syringes, setSyringes] = useState(syringeMock.syringeList);
    let i = 1

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
                                onChange={
                                    e => setSyringes(syringeMock.syringeList.filter(
                                        item => item.id.includes(e.target.value)
                                    ))
                                }
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
                        {syringes.map((item) => (
                            <ListItem key={item.id}>
                                <ListItemCell style={{
                                    paddingLeft: "14px",
                                    borderTop: item.demolished === false && !item.reservedTill 
                                        ? '2px solid #FEAB0D': '',
                                    borderBottom: item.demolished === false && !item.reservedTill
                                        ? '2px solid #FEAB0D': '',
                                    borderLeft: item.demolished === false && !item.reservedTill
                                        ? '2px solid #FEAB0D': ''
                                }}>
                                    {i++}
                                </ListItemCell>
                                <ListItemCell style={{
                                    paddingLeft: "14px",
                                    borderTop: item.demolished === false && !item.reservedTill 
                                        ? '2px solid #FEAB0D': '',
                                    borderBottom: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': ''
                                }}>
                                    <SyringeIcon/>
                                </ListItemCell>
                                <ListItemCell style={{
                                    paddingLeft: "14px",
                                    borderTop: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': '',
                                    borderBottom: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': ''
                                }}>
                                    Benešov
                                </ListItemCell>
                                <ListItemCell style={{
                                    paddingLeft: "14px",
                                    borderTop: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': '',
                                    borderBottom: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': ''
                                }}>
                                    Benešov - u hřiště
                                </ListItemCell>
                                <ListItemCell style={{
                                    paddingLeft: "14px",
                                    borderTop: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': '',
                                    borderBottom: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': ''
                                }}>
                                    {
                                        dayjs(item.createdAt * 1000)
                                        .format("D. M. YYYY")
                                    }
                                </ListItemCell>
                                <ListItemCell style={{
                                    paddingLeft: "14px",
                                    borderTop: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': '',
                                    borderBottom: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': ''
                                }}>
                                    {
                                    item.demolishedAt && 
                                    item.demolished === true 
                                    ? dayjs(item.demolishedAt * 1000)
                                        .format("D. M. YYYY")
                                    : <>
                                        {item.reservedTill 
                                        ? <TextMuted>
                                            rezervace do
                                            {' '}
                                            {dayjs(item.reservedTill * 1000)
                                            .format("D. M. YYYY")}
                                          </TextMuted>
                                        : <TextMuted>zatím nezlikvidováno</TextMuted>
                                        }
                                      </>
                                    }
                                </ListItemCell>
                                <ListItemCell  style={{
                                    paddingLeft: "14px",
                                    borderTop: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': '',
                                    borderBottom: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': ''
                                }}>
                                    Magdalena
                                </ListItemCell>
                                <ListItemCell style={{
                                    paddingLeft: "14px",
                                    borderTop: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': '',
                                    borderBottom: item.demolished === false && !item.reservedTill 
                                        ? '2px solid #FEAB0D': ''
                                }}>
                                    {
                                    item.demolishedAt && 
                                    item.demolished === true 
                                    ? <TextMutedBold>
                                        Zlikvidováno
                                      </TextMutedBold>
                                    : <>
                                        {item.reservedTill 
                                        ? <TextHighlight>
                                            Rezervováno TP
                                          </TextHighlight>
                                        : <TextGold>Čeká na likvidaci</TextGold>
                                        }
                                      </>
                                    }
                                </ListItemCell>
                                <ListItemCell  style={{
                                    paddingLeft: "14px",
                                    borderTop: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': '',
                                    borderBottom: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': ''
                                }}>
                                    <EditIcon />
                                </ListItemCell>
                                <ListItemCell style={{
                                    paddingLeft: "14px",
                                    borderTop: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': '',
                                    borderBottom: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': '',
                                    borderRight: item.demolished === false && !item.reservedTill  
                                        ? '2px solid #FEAB0D': ''
                                }}>
                                    <CheckboxRadio type="checkbox" />
                                </ListItemCell>
                            </ListItem>
                        ))}
                        </tbody>

                    </ListWrapper>
                </Box>
            </Box>
        </>
    );
};

export default NavodLikvidace;
