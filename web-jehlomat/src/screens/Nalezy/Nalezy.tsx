import React, { FunctionComponent, useEffect, useState, useCallback, useRef } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useLocation, matchPath, useRouteMatch } from 'react-router';
import { Box, Container } from '@mui/material';
import Alert from '@mui/material/Alert';
import { AxiosResponse } from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { API } from 'config/baseURL';
import { Header } from 'Components/Header/Header';
import { SyringeReadModel } from 'screens/Nalezy/types/SyringeReadModel';

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
import Page from 'screens/Nalezy/Components/Page';
import { filteringState, loaderState, paginationState, sortingState } from 'screens/Nalezy/store';
import { Filtering } from './types/Filtering';
import { LINKS } from 'routes';

const Nalezy: FunctionComponent = () => {
    const [loader, setLoader] = useRecoilState(loaderState);
    const [filters, setFilters] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const match = useRouteMatch();

    const sorting = useRecoilValue(sortingState);
    const filtering = useRecoilValue(filteringState);
    const paging = useRecoilValue(paginationState);

    const isMapMatch = matchPath(location.pathname, '/nalezy/mapa');
    const isTableMatch = matchPath(location.pathname, '/nalezy');

    const isMap = isMapMatch?.isExact;
    const isTable = isTableMatch?.isExact;

    const [exportUrl, setExportUrl] = useState<string | undefined>();
    const [exportErrorMessage, setExportErrorMessage] = useState<string | null>(null);
    const exportRef = useRef<HTMLAnchorElement | null>(null);

    const exportFiltered = useCallback(async () => {
        const response: AxiosResponse = await API.post('/syringe/export', filtering);
        if (response.status === 200) {
            setExportErrorMessage(null);
            setExportUrl(window.URL.createObjectURL(new Blob([response.data as ArrayBuffer])));
            exportRef.current?.click();
        } else if (response.status === 400) {
            // Temporary solution, we expect that the main reason for error 400 is wrong range filter
            setExportErrorMessage('Export se nepodařil, zkontrolujte prosím, že je aktivní filtr období nálezu nebo likvidace.');
            console.warn('Export error:', response.data);
        } else {
            setExportErrorMessage('Export se nepodařil, pokusíme se to opravit.');
            console.warn('Export error:', response);
        }
    }, [filtering]);

    const hasValidRangeFilter = (filters: Filtering): boolean => {
        const rangeFilters = filters?.createdAt || filters?.demolishedAt;
        return !!(rangeFilters?.from || rangeFilters?.to);
    };

    useEffect(() => {
        if (hasValidRangeFilter(filtering)) {
            setExportErrorMessage(null);
        }
    }, [filtering]);

    useEffect(() => {
        const filter = {
            ordering: sorting,
            filter: filtering,
            pageInfo: paging,
        };

        const load = async () => {
            const response: AxiosResponse<SyringeReadModel> = await API.post('/syringe/search', filter);
            if (response.status !== 200) throw new Error('Unable to load data');

            return response.data;
        };

        load()
            .then(data => setLoader({ resp: data }))
            .catch(e => {
                setLoader({ err: e });
                console.warn(e);
            });
    }, [sorting, filtering, paging]);

    return (
        <>
            <Header mobileTitle="Seznam zadaných nálezů" />

            <Page>
                <Container>
                    <Box mt={5} mb={2} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                        <TextHeader>Seznam zadaných nálezů</TextHeader>
                        <Controls>
                            <Button onClick={exportFiltered}>Export</Button>
                            <a href={exportUrl} download="export.csv" ref={exportRef} style={{ display: 'none' }} />
                            <Button onClick={() => setFilters(s => !s)}>Filtrovat</Button>
                            {isTable && <DarkButton onClick={() => history.push('/nalezy/mapa')}>Mapa</DarkButton>}
                            {isMap && <DarkButton onClick={() => history.push('/nalezy')}>Seznam</DarkButton>}
                        </Controls>
                    </Box>
                </Container>
                {exportErrorMessage && (
                    <Container>
                        <Box my={2}>
                            <Alert severity="warning">{exportErrorMessage}</Alert>
                        </Box>
                    </Container>
                )}
                {filters && (
                    <Filters>
                        <HorizontalContainer>
                            <FilterByRange />
                            <FilterByReporter />
                            <FilterByState />
                        </HorizontalContainer>
                    </Filters>
                )}
                <Switch>
                    <Route path={LINKS.FINDINGS} exact={true}>
                        <Table loader={loader} />
                    </Route>
                    <Route path={LINKS.FINDINGS_MAPA} exact={true}>
                        <Map loader={loader} />
                    </Route>
                </Switch>
            </Page>
        </>
    );
};

export default Nalezy;
