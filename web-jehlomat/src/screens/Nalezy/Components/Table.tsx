import React, { FunctionComponent } from 'react';
import { SyringeReadModel } from '../types/SyringeReadModel';
import { styled } from '@mui/system';
import SortableHeading from './SortableHeading';
import { SortableColumn } from '../types/SortableColumn';
import { SortDirection } from '../types/SortDirection';
import SyringeRow from './SyringeRow';
import Heading from './Heading';
import EmptyState from "./EmptyState";
import {Button, Container} from "@mui/material";
import LoadingState from "./LoadingState";
import {Loader} from "../types/Loader";
import ErrorState from "./ErrorState";
import {Syringe} from "../types/Syringe";

interface TableProps {
    loader: Loader<SyringeReadModel>;
    direction: (column: SortableColumn) => SortDirection;
    onSort: (column: SortableColumn) => () => void;
    selected: Syringe[];
    onSelect: (syringe: Syringe) => void;
}

const Wrapper = styled('table')({
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
    width: '100%',
});

const Header = styled('tr')({
    width: '100%',
});

const Table: FunctionComponent<TableProps> = ({ loader, direction, onSort, selected, onSelect }) => {
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
                    {loading && (
                        <LoadingState />
                    )}
                    {error && (
                        <ErrorState text="An error occured while loading data" />
                    )}
                    {(loaded && data.length === 0) && (
                        <EmptyState
                            text="No data to show"
                            description="No syringers are reported or filter combination returns no data"
                        />
                    )}
                    {(loaded && data.length > 0) && data.map(item => (
                        <SyringeRow key={item.id} syringe={item} selected={selected} onSelect={onSelect} />
                    ))}
                </tbody>
            </Wrapper>
        </Container>
    );
};

export default Table;
