import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useRouteMatch } from 'react-router';
import { Switch, Route } from 'react-router-dom';
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
import { mock } from './__mock';
import Map from "./Components/Map";
import {styled} from "@mui/system";

const Page = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
});

const Nalezy: FunctionComponent = () => {
    const [data, setData] = useState<SyringeReadModel>();
    const [filters, setFilters] = useState(false);

    const match = useRouteMatch();
    const { direction, handleSort, filter, filterByRange, resetByRange, filterByReporter, resetByReporter, filterByState, resetByState } = useFindingsFilter();

    useEffect(() => {
        const load = async () => {
            const response: AxiosResponse<SyringeReadModel> = await API.post('/syringe/search', filter);
            if (response.status !== 200) throw new Error('Unable to load data');

            return response.data;
        };

        load()
            .then(data => {
                setData(mock);
            })
            .catch(e => console.warn(e));
    }, [filter]);

    const handleRangeFilter = useCallback((kind, from, to) => {
        filterByRange(kind, { from: +from, to: +to });
    }, []);

    return (
        <>
            <Header mobileTitle="Seznam zadaných nálezů" />

            <Page>
                <Box mt={5} mb={2} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Box>
                        <TextHeader>Seznam zadaných nálezů</TextHeader>
                    </Box>
                    <Controls>
                        <Button>Vybrat vše</Button>
                        <Button>Exportovat vybrané</Button>
                        <Button onClick={() => setFilters(s => !s)}>Filtrovat</Button>
                        <Button>Mapa</Button>
                    </Controls>
                </Box>
                {filters && (
                    <Filters>
                        <FilterByRange onFilter={handleRangeFilter} onReset={resetByRange} />
                        <FilterByReporter onFilter={filterByReporter} onReset={resetByReporter} />
                        <FilterByState onFilter={filterByState} onReset={resetByState} />
                    </Filters>
                )}
                <Switch>
                    <Route path={`${match.path}/`} exact={true}>
                        <Table data={data} direction={direction} onSort={handleSort} />
                    </Route>
                    <Route path={`${match.path}/mapa/`} exact={true}>
                        <Map data={data} />
                    </Route>
                </Switch>
            </Page>
        </>
    );
};

export default Nalezy;
