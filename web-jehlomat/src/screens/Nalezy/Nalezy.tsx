import React, {useState, FC, useEffect} from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {ClickAwayListener, Popper, useMediaQuery} from '@mui/material';
import {
    Button,
    Controls,
    TextHeader,
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
    TextHighlight, Links, ActionLink,
} from './NalezyStyles';
import { Header } from 'Components/Header/Header';
import SearchInput from 'Components/Inputs/SearchInput/SearchInput';
import SearchInputDesktop from 'Components/Inputs/SearchInput/SearchInputDesktop';
import { media } from 'utils/media';
import {IListSyringe, ISyringe, syringeMock} from './syringeMock';
import { API } from "config/baseURL";
import {AxiosResponse} from "axios";

dayjs().format();

type SortableColumn 
    = "TOWN" 
    | "CREATED_AT" 
    | "CREATED_BY" 
    | "DEMOLISHED_AT";

interface Order {
    column: SortableColumn;
    direction: "ASC" | "DESC";
}

const swapOrder = (order: Order): Order => {
    if (order.direction === "ASC") return { ...order, direction: "DESC" };

    return { ...order, direction: "ASC" };
};

const NavodLikvidace: FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    
    const isMobile = useMediaQuery(media.lte('mobile'));
    const [syringes, setSyringes] = useState(syringeMock.syringeList);
    const [order, setOrder] = useState<Array<Order>>([]);
    const [selected, setSelected] = useState<Array<ISyringe>>([]);
    const [edit, setEdit] = useState<ISyringe | null>();
    
    let i = 1;
    
    useEffect(() => {
        const load = async () => {
            const response: AxiosResponse<IListSyringe> = await API.post('/api/v1/jehlomat/syringe/search', {
                filter: {},
                pageInfo: {
                    index: 0,
                    size: 20,
                },
                ordering: order,
            });
            if (response.status !== 200) throw new Error("Unable to load data");
            
            return response.data;
        };
        
        load().then(data => console.log("Loaded!", data)).catch(e => console.warn(e));
    }, [ order ]);
    
    const handleSort = (column: SortableColumn) => () => {
        setOrder(state => {
            const exists = state.find(o => o.column === column);
            if (exists) return state.map(o => o.column === column ? swapOrder(o) : o);
            
            return [ ...state, ({ column: column, direction: "ASC" }) ];
        });
    };

    const handleOpenActions = (syringe: ISyringe) => (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
        setEdit(syringe);
    };

    return (
        <>
            <Header mobileTitle="Seznam zadaných nálezů" />

            {!isMobile && (
                // mobilne komponenty
                <></>
            )}

            <Box maxWidth={1300} width={1} ml="auto" mr="auto" mt={8} style={{ flexGrow: 1 }}>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                        <TextHeader>Seznam zadaných nálezů</TextHeader>
                    </Box>
                    {isMobile && (
                        <Box>
                            <SearchInput placeholder="Hledat" />
                        </Box>
                    )}
                    <Controls>
                        {!isMobile && (
                            <SearchInputDesktop placeholder="Hledat" onChange={e => setSyringes(syringeMock.syringeList.filter(item => item.id.includes(e.target.value)))} />
                        )}
                        <Button>Filtrovat</Button>
                        <Button>Vybrat vše</Button>
                        <Button>Exportovat vybrané</Button>
                    </Controls>
                </Grid>
                <Box mt={2}>
                    <ListWrapper>
                        <thead>
                            <ListHeader>
                                <ListHeaderItem />
                                <ListHeaderItem />
                                <ListHeaderItem onClick={handleSort("TOWN")}>Město</ListHeaderItem>
                                <ListHeaderItem>Název</ListHeaderItem>
                                <ListHeaderItem onClick={handleSort("CREATED_AT")}>Datum nálezu</ListHeaderItem>
                                <ListHeaderItem onClick={handleSort("DEMOLISHED_AT")}>Datum likvidace</ListHeaderItem>
                                <ListHeaderItem onClick={handleSort("CREATED_BY")}>Zadavatel</ListHeaderItem>
                                <ListHeaderItem>Stav</ListHeaderItem>
                                <ListHeaderItem />
                            </ListHeader>
                        </thead>
                        <tbody>
                            {syringes.map(item => (
                                <ListItem key={item.id}>
                                    <ListItemCell syringe={item}>
                                        {i++}
                                    </ListItemCell>
                                    <ListItemCell syringe={item}>
                                        <SyringeIcon />
                                    </ListItemCell>
                                    <ListItemCell syringe={item}>
                                        Benešov
                                    </ListItemCell>
                                    <ListItemCell syringe={item}>
                                        Benešov - u hřiště
                                    </ListItemCell>
                                    <ListItemCell syringe={item}>
                                        {dayjs(item.createdAt * 1000).format('D. M. YYYY')}
                                    </ListItemCell>
                                    <ListItemCell syringe={item}>
                                        {item.demolishedAt && item.demolished === true ? (
                                            dayjs(item.demolishedAt * 1000).format('D. M. YYYY')
                                        ) : (
                                            <>
                                                {item.reservedTill ? (
                                                    <TextMuted>rezervace do {dayjs(item.reservedTill * 1000).format('D. M. YYYY')}</TextMuted>
                                                ) : (
                                                    <TextMuted>zatím nezlikvidováno</TextMuted>
                                                )}
                                            </>
                                        )}
                                    </ListItemCell>
                                    <ListItemCell syringe={item}>
                                        Magdalena
                                    </ListItemCell>
                                    <ListItemCell syringe={item}>
                                        {item.demolishedAt && item.demolished === true ? (
                                            <TextMutedBold>Zlikvidováno</TextMutedBold>
                                        ) : (
                                            <>{item.reservedTill ? <TextHighlight>Rezervováno TP</TextHighlight> : <TextGold>Čeká na likvidaci</TextGold>}</>
                                        )}
                                    </ListItemCell>
                                    <ListItemCell syringe={item}>
                                        <EditIcon onClick={handleOpenActions(item)} />
                                        <Popper
                                            open={Boolean(anchorEl)}
                                            anchorEl={anchorEl}
                                            placement="bottom"
                                        >
                                            <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                                                <Links>
                                                    <ul>
                                                        <li><ActionLink to="/">Zlikvidovat nález</ActionLink></li>
                                                        <li><ActionLink to="/">Upravit</ActionLink></li>
                                                        <li><ActionLink to="/">Smazat</ActionLink></li>
                                                    </ul>
                                                </Links>
                                            </ClickAwayListener>
                                        </Popper>
                                    </ListItemCell>
                                    <ListItemCell syringe={item}>
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
