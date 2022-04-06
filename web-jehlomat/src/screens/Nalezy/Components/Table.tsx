import React, { FunctionComponent } from 'react';
import { SyringeReadModel } from '../types/SyringeReadModel';
import { styled } from '@mui/system';
import SortableHeading from './SortableHeading';
import { SortableColumn } from '../types/SortableColumn';
import { SortDirection } from '../types/SortDirection';
import SyringeRow from './SyringeRow';
import Heading from './Heading';

interface TableProps {
    data: SyringeReadModel | undefined;
    direction: (column: SortableColumn) => SortDirection;
    onSort: (column: SortableColumn) => () => void;
}

const Wrapper = styled('table')({
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
    width: '100%',
});

const Header = styled('tr')({
    width: '100%',
});

const Table: FunctionComponent<TableProps> = ({ data, direction, onSort }) => {
    return (
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
                {data?.syringeList.map(item => (
                    <SyringeRow key={item.id} syringe={item} />
                ))}
            </tbody>
        </Wrapper>
    );
};

export default Table;
