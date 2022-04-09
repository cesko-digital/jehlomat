import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useLocation, useRouteMatch } from 'react-router';
import { Switch, Route, useHistory } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { API } from 'config/baseURL';
import { SyringeReadModel } from './types/SyringeReadModel';
import useFindingsFilter from './hooks/useFindingsFilter';
import { Header } from 'Components/Header/Header';
import FilterByRange from './Components/FilterByRange';
import FilterByReporter from './Components/FilterByReporter';
import Filters from './Components/Filters';
import FilterByState from './Components/FilterByState';
import Table from './Components/Table';
import Controls from './Components/Controls';
import Button from './Components/Button';
import TextHeader from './Components/TextHeader';
import HorizontalContainer from './Components/HorizontalContainer';
import { mock } from './__mock';
import Map from './Components/Map';
import { styled } from '@mui/system';
import { Loader } from './types/Loader';
import { DarkButton } from './Components/DarkButton';
import { matchPath } from 'react-router';
import { Syringe } from './types/Syringe';

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
    const { direction, handleSort, filter, filterByRange, resetByRange, filterByReporter, resetByReporter, filterByState, resetByState } = useFindingsFilter();

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
                        <Table loader={loader} direction={direction} onSort={handleSort} selected={selected} onSelect={handleSelect} />
                    </Route>
                    <Route path={`${match.path}/mapa/`} exact={true}>
                        <Map loader={loader} />
                    </Route>
                </Switch>
            </Page>
        </>
    );
};

export default Nalezy;
