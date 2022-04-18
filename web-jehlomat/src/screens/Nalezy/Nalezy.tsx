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
    CheckboxRadio,
    TextMuted,
    TextMutedBold,
    TextGold,
    TextHighlight, Links, ActionLink, RoundButton, SortableListHeaderItem
} from './NalezyStyles';
import { Header } from 'Components/Header/Header';
import SearchInput from 'Components/Inputs/SearchInput/SearchInput';
import SearchInputDesktop from 'Components/Inputs/SearchInput/SearchInputDesktop';
import { media } from 'utils/media';
import {IListSyringe, ISyringe, syringeMock} from './syringeMock';
import { API } from "config/baseURL";
import {AxiosResponse} from "axios";
import { ReactComponent as SyringeCrossedIcon } from 'assets/icons/crossed-syringe.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete.svg';
import {ZoomIcon, Input, Select, Filter, Filters} from "./Components/Filter";

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

const NavodLikvidace: FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    
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
    
    useEffect(() => { console.log(selected); }, [ selected ]);
    
    const handleSort = (column: SortableColumn) => () => {
        // Order by order: void -> ASC -> DESC -> void
        setOrder(state => {
            const exists = state.find(o => o.column === column);
            console.log(exists, state);
            if (exists) {
                const filtered = [ ...state.filter(o => o.column !== column) ];
                if (exists.direction === "ASC") {
                    return [ ...filtered, ({ column: column, direction: "DESC" }) ];
                }
                
                return filtered;
            }
            
            return [ ...state, ({ column: column, direction: "ASC" }) ];
        });
    };

    const handleOpenActions = (syringe: ISyringe) => (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setEdit(syringe);
    };
    
    const handleSelect = (syringe: ISyringe) => () => setSelected(state => {
        const i = state.find(s => s.id === syringe.id);
        if (i) return [ ...state.filter(s => s.id !== syringe.id) ];
        
        return [ ...state, syringe ];
    });
    
    const direction = (column: SortableColumn): "ASC" | "DESC" | undefined => {
        const current = order.find(o => o.column === column);
        if (!current) return undefined;
        
        return current.direction;
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
                <Filters>
                    <Filter title="Lokalita">
                        <Input><ZoomIcon /></Input>
                    </Filter>
                    <Filter title="Období">
                        <Input><ZoomIcon /></Input>
                    </Filter>
                    <Filter title="Zadavatel nálezu">
                        <Input><ZoomIcon /></Input>
                    </Filter>
                    <Filter title="Stav">
                        <Select>
                            <option>Zlikvidováno</option>
                            <option>Čeká na likvidaci</option>
                            <option>Rezervováno TP</option>
                        </Select>
                    </Filter>
                </Filters>
                <Box mt={2}>
                    <ListWrapper>
                        <thead>
                            <ListHeader>
                                <ListHeaderItem />
                                <ListHeaderItem />
                                <SortableListHeaderItem direction={direction("TOWN")} onClick={handleSort("TOWN")}>Město</SortableListHeaderItem>
                                <ListHeaderItem>Název</ListHeaderItem>
                                <SortableListHeaderItem direction={direction("CREATED_AT")} onClick={handleSort("CREATED_AT")}>Datum nálezu</SortableListHeaderItem>
                                <SortableListHeaderItem direction={direction("DEMOLISHED_AT")} onClick={handleSort("DEMOLISHED_AT")}>Datum likvidace</SortableListHeaderItem>
                                <SortableListHeaderItem direction={direction("CREATED_BY")} onClick={handleSort("CREATED_BY")}>Zadavatel</SortableListHeaderItem>
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
                                        <RoundButton onClick={handleOpenActions(item)}>
                                            <EditIcon />
                                        </RoundButton>
                                        <Popper
                                            open={Boolean(anchorEl)}
                                            anchorEl={anchorEl}
                                            placement="bottom"
                                        >
                                            <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                                                <Links>
                                                    <ul>
                                                        <li>
                                                            <ActionLink to="/">
                                                                <span>Zlikvidovat nález</span>
                                                                <SyringeCrossedIcon style={{ width: "24px", height: "24px" }} />
                                                            </ActionLink>
                                                        </li>
                                                        <li>
                                                            <ActionLink to="/">
                                                                <span>Upravit</span>
                                                                <EditIcon style={{ width: "20px", height: "20px" }} />
                                                            </ActionLink>
                                                        </li>
                                                        <li>
                                                            <ActionLink to="/">
                                                                <span>Smazat</span>
                                                                <DeleteIcon style={{ width: "24px", height: "24px" }} />
                                                            </ActionLink>
                                                        </li>
                                                    </ul>
                                                </Links>
                                            </ClickAwayListener>
                                        </Popper>
                                    </ListItemCell>
                                    <ListItemCell syringe={item}>
                                        <CheckboxRadio type="checkbox" onChange={handleSelect(item)} />
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
