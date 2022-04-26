import React, { FunctionComponent } from 'react';
import { Container } from '@mui/material';
import { styled } from '@mui/system';
import { SyringeReadModel } from 'screens/Nalezy/types/SyringeReadModel';
import { Syringe } from 'screens/Nalezy/types/Syringe';
import { SortableColumn } from 'screens/Nalezy/types/SortableColumn';
import { SortDirection } from 'screens/Nalezy/types/SortDirection';
import { Loader } from 'utils/Loader';
import SortableHeading from 'screens/Nalezy/Components/SortableHeading';
import SyringeRow from 'screens/Nalezy/Components/SyringeRow';
import Heading from 'screens/Nalezy/Components/Heading';
import EmptyState from 'screens/Nalezy/Components/EmptyState';
import LoadingState from 'screens/Nalezy/Components/LoadingState';
import ErrorState from 'screens/Nalezy/Components/ErrorState';

interface TableProps {
    loader: Loader<SyringeReadModel>;
    direction: (column: SortableColumn) => SortDirection;
    onSort: (column: SortableColumn) => () => void;
    selected: Syringe[];
    onSelect: (syringe: Syringe) => void;
    onUpdate: () => void;
}

const Wrapper = styled('table')({
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
    width: '100%',
});

const Header = styled('tr')({
    width: '100%',
});

const Table: FunctionComponent<TableProps> = ({ loader, direction, onSort, selected, onSelect, onUpdate }) => {
    const loading = loader.resp === undefined && loader.err === undefined;
    const error = loader.resp === undefined && loader.err !== undefined;
    const loaded = loader.resp !== undefined;
    const data = loader.resp?.syringeList || [];

    return (
        <Container>
            <Wrapper>
                <thead>
                    <Header>
                        <Heading />
                        <SortableHeading direction={direction('TOWN')} onClick={onSort('TOWN')}>
                            Město
                        </SortableHeading>
                        <Heading>Název</Heading>
                        <SortableHeading direction={direction('CREATED_AT')} onClick={onSort('CREATED_AT')}>
                            Datum nálezu
                        </SortableHeading>
                        <SortableHeading direction={direction('DEMOLISHED_AT')} onClick={onSort('DEMOLISHED_AT')}>
                            Datum likvidace
                        </SortableHeading>
                        <SortableHeading direction={direction('CREATED_BY')} onClick={onSort('CREATED_BY')}>
                            Zadavatel
                        </SortableHeading>
                        <Heading>Stav</Heading>
                        <Heading />
                    </Header>
                </thead>
                <tbody>
                    {loading && <LoadingState />}
                    {error && <ErrorState text="Nastala chyba při načítání záznamů" />}
                    {loaded && data.length === 0 && <EmptyState text="Žádná data" description="Nebyly nalezeny žádné nálezy nebo žádné záznamy nevyhovují aktuální kombinaci filtrů" />}
                    {loaded && data.length > 0 && data.map(item => <SyringeRow key={item.id} syringe={item} selected={selected} onSelect={onSelect} onUpdate={onUpdate} />)}
                </tbody>
            </Wrapper>
        </Container>
    );
};

export default Table;
