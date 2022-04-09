import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useLocation, matchPath, useRouteMatch } from 'react-router';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/system';
import { AxiosResponse } from 'axios';
import { API } from 'config/baseURL';
import { Header } from 'Components/Header/Header';
import { SyringeReadModel } from 'screens/Nalezy/types/SyringeReadModel';
import { Loader } from 'screens/Nalezy/types/Loader';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import useFindingsFilter from 'screens/Nalezy/hooks/useFindingsFilter';
import FilterByRange from 'screens/Nalezy/Components/FilterByRange';
import FilterByReporter from 'screens/Nalezy/Components/FilterByReporter';
import FilterByState from 'screens/Nalezy/Components/FilterByState';
import Table from 'screens/Nalezy/Components/Table';
import Controls from 'screens/Nalezy/Components/Controls';
import Button from 'screens/Nalezy/Components/Button';
import TextHeader from 'screens/Nalezy/Components/TextHeader';
import Map from 'screens/Nalezy/Components/Map';
import DarkButton from 'screens/Nalezy/Components/DarkButton';
import Filters from 'screens/Nalezy/Components/Filters';
import HorizontalContainer from 'screens/Nalezy/Components/HorizontalContainer';
import { mock } from 'screens/Nalezy/__mock';

const Page = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
});

const Nalezy: FunctionComponent = () => {
    const [loader, setLoader] = useState<Loader<SyringeReadModel>>({});
    const [filters, setFilters] = useState(false);
    const [selected, setSelected] = useState<Syringe[]>([]);
    const history = useHistory();
    const location = useLocation();
    const match = useRouteMatch();
    const { direction, handleSort, filter, filterByRange, resetByRange, filterByReporter, resetByReporter, filterByState, resetByState, reload } = useFindingsFilter();

    const isMapMatch = matchPath(location.pathname, '/nalezy/mapa');
    const isTableMatch = matchPath(location.pathname, '/nalezy');

    const isMap = isMapMatch?.isExact;
    const isTable = isTableMatch?.isExact;

    useEffect(() => {
        const load = async () => {
            const response: AxiosResponse<SyringeReadModel> = await API.post('/syringe/search', filter);
            if (response.status !== 200) throw new Error('Unable to load data');

            return response.data;
        };

        load()
            .then(data => {
                setLoader({ resp: mock });
                // setData(mock);
            })
            .catch(e => console.warn(e));
    }, [filter]);

    const handleRangeFilter = useCallback((kind, from, to) => {
        filterByRange(kind, { from: +from, to: +to });
    }, []);

    const handleSelect = useCallback(
        (syringe: Syringe) =>
            setSelected(state => {
                const exists = state.find(({ id }) => id === syringe.id);
                if (exists) {
                    return state.filter(({ id }) => id !== syringe.id);
                }

                return [...state, syringe];
            }),
        [],
    );

    const handleSelectAll = useCallback(() => {
        if (loader.resp && Array.isArray(loader.resp.syringeList)) {
            setSelected([ ...loader.resp.syringeList ]);
        }
    }, [loader]);

    return (
        <>
            <Header mobileTitle="Seznam zadaných nálezů" />

            <Page>
                <Container>
                    <Box mt={5} mb={2} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <TextHeader>Seznam zadaných nálezů</TextHeader>
                        </Box>
                        <Controls>
                            <Button onClick={handleSelectAll}>Vybrat vše</Button>
                            <Button>Exportovat vybrané</Button>
                            <Button onClick={() => setFilters(s => !s)}>Filtrovat</Button>
                            {isTable && <DarkButton onClick={() => history.push('/nalezy/mapa')}>Mapa</DarkButton>}
                            {isMap && <DarkButton onClick={() => history.push('/nalezy')}>Seznam</DarkButton>}
                        </Controls>
                    </Box>
                </Container>
                {filters && (
                    <Filters>
                        <HorizontalContainer>
                            <FilterByRange onFilter={handleRangeFilter} onReset={resetByRange} />
                            <FilterByReporter onFilter={filterByReporter} onReset={resetByReporter} />
                            <FilterByState onFilter={filterByState} onReset={resetByState} />
                        </HorizontalContainer>
                    </Filters>
                )}
                <Switch>
                    <Route path={`${match.path}/`} exact={true}>
                        <Table loader={loader} direction={direction} onSort={handleSort} selected={selected} onSelect={handleSelect} onUpdate={reload} />
                    </Route>
                    <Route path={`${match.path}/mapa/`} exact={true}>
                        <Map loader={loader} onUpdate={reload} />
                    </Route>
                </Switch>
            </Page>
        </>
    );
};

export default Nalezy;
